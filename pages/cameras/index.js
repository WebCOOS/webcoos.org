import React, { useState, useEffect, useMemo } from 'react';

import { Section, SectionHeader } from '@axds/landing-page-components';
import Page from '../../components/Page';

import { getSiteMetadata, getYaml } from '../../utils';
import { useAPIContext } from '../../components/contexts/ApiContext';
import { parseWebCOOSAsset } from '../../components/utils/webCOOSHelpers';
import classNames from 'classnames';
import { utcToZonedTime, format } from 'date-fns-tz';
import { IconCamera, IconVideoCamera } from '../../components/Icon';

import Link from 'next/link';
import dynamic from 'next/dynamic';

const CameraLandingSection = dynamic(() => import('../../components/CameraLandingSection'), { ssr: false });

const formatInTimeZone = (date, fmt, tz) => format(utcToZonedTime(date, tz), fmt, { timeZone: tz });

export default function Cameras({ cameras, metadata, parsedMetadata }) {
    const { apiUrl, apiVersion, token, source } = useAPIContext();

    const defaultTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/New_York';
    const [curCameras, setCurCameras] = useState([]);

    useEffect(() => {
        fetch(`${apiUrl}/${apiVersion}/assets/?source=${source}`, {
            headers: {
                Authorization: `Token ${token}`,
                Accept: 'application/json',
            },
        })
            .then((response) => response.json())
            .then((result) => {
                const parsedCams = result.results.map((item) => {
                        const parsedItem = parseWebCOOSAsset(item);
                        if (!parsedItem) {
                            return null;
                        }

                        return parsedItem;
                    }),
                    filteredCams = parsedCams.filter(
                        (pc) => pc !== null && cameras.cameras.active.indexOf(pc.slug) !== -1
                    );

                setCurCameras(filteredCams);
            });
    }, []);
    
    // creates an object, slug -> {starting: Date, ending: Date}
    // uses static metadata at first then when the current metadata loads uses that
    const dateRanges = useMemo(() => {
        const srcData = curCameras || parsedMetadata;

        return Object.fromEntries(
            srcData.map((c) => {
                return [
                    c.slug,
                    {
                        starting: c.dateBounds && c.dateBounds[0] ? Date.parse(c.dateBounds[0]) : null,
                        ending: c.dateBounds && c.dateBounds[1] ? Date.parse(c.dateBounds[1]) : null,
                    }
                ];
            })
        );
    }, [parsedMetadata, curCameras]);

    return (
        <Page metadata={metadata} title='Cameras'>
            <Section>
                <SectionHeader>Cameras</SectionHeader>

                <table className='w-full table-auto'>
                    <thead>
                        <tr className='bg-primary text-primary-lighter uppercase text-sm leading-normal text-left'>
                            <th className='py-3'></th>
                            <th className='py-3 lg:pl-3 pl-1 text-left'>Camera</th>
                            <th className='py-3 lg:px-6 px-2 text-left hidden lg:table-cell'>Data Access Slug</th>
                            <th className='py-3 lg:px-6 px-2 text-left'>Provider</th>
                            <th className='py-3 lg:px-6 px-2 text-left'>Status</th>
                            <th className='py-3 lg:px-6 px-2 text-left'>
                                <span className='lg:hidden'>Range</span>
                                <span className='hidden lg:table-cell'>Starting</span>
                            </th>
                            <th className='py-3 lg:px-6 px-2 text-left hidden lg:table-cell'>Ending</th>
                            <th className='py-3 lg:px-6 px-2 text-left'>Gallery Links</th>
                        </tr>
                    </thead>
                    <tbody className='text-gray-800 text-sm'>
                        {(curCameras || parsedMetadata).map((c, ci) => {
                            return (
                                <tr
                                    key={c.slug}
                                    className={classNames('border-b border-gray-200 hover:bg-gray-200 ', {
                                        'bg-gray-100 ': ci % 2 === 0,
                                        'bg-white': ci % 2 !== 0,
                                    })}
                                >
                                    <td className='py-3 lg:pl-3 pl-1 text-left min-w-max'>
                                        {c.thumbnails && c.thumbnails.square_small && (
                                            <img
                                                src={c.thumbnails.square_small}
                                                alt={c.label}
                                                className='w-8 inline-block align-middle rounded-sm shadow'
                                            />
                                        )}
                                    </td>
                                    <td className='py-3 lg:pl-3 pl-1 text-left whitespace-nowrap'>
                                        <Link href={`/cameras/${c.slug}`}>
                                            <a className='text-primary hover:text-primary-darker hover:underline'>
                                                <span>{c.label}</span>

                                                {(c.dash_url || c.hls_url) && (
                                                    <span className='ml-2 text-xs uppercase bg-primary text-primary-lighter text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-green-200 dark:text-green-900 animate-pulse'>
                                                        Live
                                                    </span>
                                                )}
                                            </a>
                                        </Link>

                                        <div className='font-mono text-xs lg:hidden'>{c.slug}</div>
                                    </td>
                                    <td className='py-3 lg:px-6 px-2 text-left font-mono text-xs hidden lg:table-cell'>
                                        {c.slug}
                                    </td>
                                    <td className='py-3 lg:px-6 px-2 text-left'>{c.group}</td>
                                    <td className='py-3 lg:px-6 px-2 text-left'></td>
                                    <td className='py-3 lg:px-6 px-2 text-left text-xs font-mono'>
                                        {dateRanges && dateRanges[c.slug] && dateRanges[c.slug].starting && (
                                            <span>
                                                {formatInTimeZone(
                                                    dateRanges[c.slug].starting,
                                                    'yyyy-MM-dd',
                                                    c.timezone || defaultTimeZone
                                                )}
                                            </span>
                                        )}
                                        <span className='lg:hidden'>
                                            {' - '}
                                            <br />
                                            {dateRanges && dateRanges[c.slug] && dateRanges[c.slug].ending && (
                                                <span>
                                                    {formatInTimeZone(
                                                        dateRanges[c.slug].ending,
                                                        'yyyy-MM-dd',
                                                        c.timezone || defaultTimeZone
                                                    )}
                                                </span>
                                            )}
                                        </span>
                                    </td>
                                    <td className='py-3 lg:px-6 px-2 text-left font-mono text-xs hidden lg:table-cell'>
                                        {dateRanges && dateRanges[c.slug] && dateRanges[c.slug].ending && (
                                            <span>
                                                {formatInTimeZone(
                                                    dateRanges[c.slug].ending,
                                                    'yyyy-MM-dd',
                                                    c.timezone || defaultTimeZone
                                                )}
                                            </span>
                                        )}
                                    </td>
                                    <td className='py-3 lg:px-6 px-2 flex flex-col gap-1 items-start'>
                                        {c.galleryServices.map((cameraSvcProps, csi) => {
                                            return (
                                                <Link
                                                    key={cameraSvcProps.common.slug}
                                                    href={`/cameras/${c.slug}?gallery=${cameraSvcProps.common.slug}`}
                                                >
                                                    <a className='truncate inline hover:text-primary-darker hover:underline text-primary'>
                                                        {cameraSvcProps.svcType === 'img' ? (
                                                            <IconCamera
                                                                size={4}
                                                                extraClasses='inline-block pr-1 align-bottom'
                                                                paddingx={0}
                                                            />
                                                        ) : (
                                                            <IconVideoCamera
                                                                size={4}
                                                                extraClasses='inline-block pr-1 align-bottom'
                                                                paddingx={0}
                                                            />
                                                        )}
                                                        {cameraSvcProps.common.label}
                                                    </a>
                                                </Link>
                                            );
                                        })}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </Section>
        </Page>
    );
}

export async function getStaticProps() {
    const cameraYaml = await getYaml('cameras.yaml');

    // pull live metadata from API
    const apiUrl = process.env.NEXT_PUBLIC_WEBCOOS_API_URL || 'https://app.stage.webcoos.org/webcoos/api',
        apiVersion = 'v1',
        source = 'webcoos';

    const cameraMetadataResponse = await fetch(`${apiUrl}/${apiVersion}/assets/?source=${source}`, {
        headers: {
            Authorization: `Token ${process.env.NEXT_PUBLIC_WEBCOOS_API_TOKEN}`,
            Accept: 'application/json',
        },
    });

    // https://nextjs.org/docs/api-reference/data-fetching/get-static-props#notfound
    if (!cameraMetadataResponse.ok) {
        return {
            notFound: true,
        };
    }

    const sanitized = (ro) => Object.fromEntries(
            Object.entries(ro).map((p) => {
                return [p[0], p[1] === undefined ? null : p[1]];
            })
        );

    const cameraMetadataResult = await cameraMetadataResponse.json(),
        parsedMetadata = cameraMetadataResult.results.map(r => {
            const parsed = parseWebCOOSAsset(r);
            if (parsed && cameraYaml.cameras.active.indexOf(parsed.slug) !== -1) {
                return sanitized(parsed);
            }
            return null;
        }).filter(pm => pm !== null);

    return {
        props: {
            metadata: await getSiteMetadata(),
            cameras: cameraYaml,
            parsedMetadata: parsedMetadata
        },
    };
}
