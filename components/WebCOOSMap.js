import React, { useState, useEffect, useRef } from 'react';

import {Marker} from 'react-map-gl/dist/es5';
import StationCard from './StationCard';
import { parseWebCOOSAsset } from './utils/webCOOSHelpers';

import dynamic from 'next/dynamic';

const GLMap = dynamic(() => import('./GLMap'), { ssr: false });

export default function WebCOOSMap({
  stationSlugs,
  apiUrl,
  apiVersion = 'v1',
  token = process.env.NEXT_PUBLIC_WEBCOOS_API_TOKEN || process.env.STORYBOOK_WEBCOOS_API_TOKEN,
  source = 'webcoos',
  ...props
}) {
  const [stationMetadata, setStationMetadata] = useState({}); // station slug -> parsed asset
  const [selectedStation, setSelectedStation] = useState(null); // if set, slug of station, controls overlay

  useEffect(() => {
    const getMeta = async () => {
      const response = await fetch(
              `${apiUrl}/${apiVersion}/assets/?source=${source}&_nocache=true&type=webcoos.camera`,
              {
                  headers: {
                      Authorization: `Token ${token}`,
                      Accept: 'application/json',
                  },
              }
          ),
          result = await response.json();

          // @TODO: pagination

      const meta = Object.fromEntries(
          result.results
              .filter((fd) => stationSlugs.indexOf(fd.data.common.slug) !== -1)
              .map((fd) => {
                  return [
                      fd.data.common.slug,
                      {
                          ...parseWebCOOSAsset(fd),
                          anchor: fd.data.common.label.toLowerCase().indexOf('north') !== -1 ? 'top' : 'left'
                      },
                  ];
              })
      );

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
              selectedStation && (
                  <div className="absolute inset-y-0 left-0 w-full p-0 z-50 sm:w-1/2 sm:p-3 lg:w-1/3">
                      <StationCard {...stationMetadata[selectedStation]} extraClasses="pointer-events-auto" />
                  </div>
              )
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
                      <div className="bg-blue-300 cursor-pointer p-1 border border-blue-900 text-blue-900 rounded-sm shadow">
                          <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 inline"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth="2"
                          >
                              <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                              />
                          </svg>
                          <span className="pl-1">{v.label}</span>
                      </div>
                  </Marker>
              );
          })}
      </GLMap>
  );
}
