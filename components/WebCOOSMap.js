import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';

import {Marker} from 'react-map-gl/dist/es5';
import StationCard from './StationCard';
import { parseWebCOOSAsset } from './utils/webCOOSHelpers';

import dynamic from 'next/dynamic';
import { useAPIContext } from './contexts/ApiContext';
import { IconSignal, IconVideoCamera } from './Icon';

const GLMap = dynamic(() => import('./GLMap'), { ssr: false });

export default function WebCOOSMap({
  stationSlugs,
  ...props
}) {
  const { apiUrl, apiVersion, token, source } = useAPIContext();

  const [stationMetadata, setStationMetadata] = useState({}); // station slug -> parsed asset
  const [selectedStation, setSelectedStation] = useState(null); // if set, slug of station, controls overlay

  useEffect(() => {
    const getMeta = async () => {
      const response = await fetch(
              `${apiUrl}/${apiVersion}/assets/?source=${source}&type=webcoos.camera`,
              {
                  headers: {
                      Authorization: `Token ${token}`,
                      Accept: 'application/json',
                  },
              }
          ),
          result = await response.json();

        // @TODO: pagination

        const pairs = result.results
            .filter((fd) => stationSlugs.indexOf(fd.data.common.slug) !== -1)
            .map((fd) => {
                const label = fd.data.common.label.toLowerCase(); 
                return [
                    fd.data.common.slug,
                    {
                        ...parseWebCOOSAsset(fd),
                        anchor:
                            label.indexOf('north') !== -1
                                ? 'top'
                                : label.indexOf('south') !== -1
                                ? 'bottom'
                                : label.indexOf('east') !== -1
                                ? 'right'
                                : 'left',
                    },
                ];
            })

        // sort by age in the status object (then label if same age)
        pairs.sort((a, b) => {
            if (a[1].status.age === b[1].status.age) {
                return a[1].label < b[1].label;
            }
            return a[1].status.age < b[1].status.age;
        })

        const meta = Object.fromEntries(pairs);

      setStationMetadata(meta);
    }
    getMeta();

  }, [stationSlugs]);


  const onMarkerClick = (stationSlug, e) => {
      setSelectedStation(stationSlug);
      // don't let map general click handler see this!
      e.originalEvent.stopPropagation();
  }

  const onMapClick = (e) => {
      setSelectedStation(null);
  }

  return (
      <GLMap
          {...props}
          onClick={onMapClick}
          overlayComponents={
              <div className='flex flex-col'>
                  <div className='pt-3 pl-3 text-xs max-w-max'>
                      <div className='flex flex-row gap-3 bg-white text-gray-600 border border-primary shadow-lg rounded p-2'>
                          <div className='inline-flex items-center'>
                              <span className='w-2 h-2 inline-block bg-primary rounded-full mr-1 border border-primary-darker'></span>
                              <span>Active</span>
                          </div>
                          <div className='inline-flex items-center'>
                              <span className='w-2 h-2 inline-block bg-primary-lighter rounded-full mr-1 border border-gray-500'></span>
                              <span>Archive</span>
                          </div>
                          <div className='inline-flex items-center'>
                              <span className='w-2 h-2 inline-block bg-green-500 rounded-full mr-1 border border-green-700'></span>
                              <span>Live</span>
                          </div>
                          <div className='inline-flex items-center'>
                              <span className='w-2 h-2 inline-block bg-gray-400 rounded-full mr-1 border border-gray-800'></span>
                              <span>Pending</span>
                          </div>
                      </div>
                  </div>
                  <div className='relative'>
                      {selectedStation && (
                          <div className='absolute inset-y-0 left-0 w-full p-0 z-50 sm:w-1/2 sm:p-3 lg:w-1/3'>
                              <StationCard {...stationMetadata[selectedStation]} extraClasses='pointer-events-auto' />
                          </div>
                      )}
                  </div>
              </div>
          }
      >
          {Object.entries(stationMetadata).map((e) => {
              const [k, v] = e;
              return (
                  <Marker
                      key={k}
                      longitude={v.longitude}
                      latitude={v.latitude}
                      anchor={v.anchor}
                      onClick={(e) => onMarkerClick(k, e)}
                  >
                      <div
                          className={classNames(
                              'cursor-pointer p-1 shadow rounded-sm border',
                              v.status.bg,
                              v.status.fg,
                              v.status.border
                          )}
                      >
                          {v.status.slug === 'live' ? (
                              <IconSignal
                                  size={4}
                                  paddingx={0}
                                  extraClasses='inline-block align-middle animate-pulse'
                              />
                          ) : (
                              <IconVideoCamera size={4} paddingx={0} extraClasses='inline-block align-middle' />
                          )}
                          <span className='pl-1'>{v.label}</span>
                      </div>
                  </Marker>
              );
          })}
      </GLMap>
  );
}
