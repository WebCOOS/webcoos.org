import React, { useState, useEffect, useMemo } from 'react';

import { Section, SectionHeader } from '@axds/landing-page-components';
import Page from '../../components/Page';

import { getSiteMetadata } from '../../utils';
import { useAPIContext } from '../../components/contexts/ApiContext';
import { parseWebCOOSAsset, getAPIAssets } from '../../components/utils/webCOOSHelpers';
import classNames from 'classnames';
import { utcToZonedTime, format } from 'date-fns-tz';
import { IconCamera, IconVideoCamera, IconSignal } from '../../components/Icon';
import LoadingSpinner from '../../components/LoadingSpinner';

import Link from 'next/link';

const formatInTimeZone = (date, fmt, tz) => format(utcToZonedTime(date, tz), fmt, { timeZone: tz });

export default function Cameras({ metadata, parsedMetadata }) {
    const { apiUrl, apiVersion, token, source } = useAPIContext();

    const defaultTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/New_York';
    const [isLoading, setIsLoading] = useState(true);
    const [curCameras, setCurCameras] = useState([]);

    useEffect(() => {
        const getCurrentCams = async () => {
            let result;

            try {
                result = await getAPIAssets({apiUrl: apiUrl, apiVersion: apiVersion, token: token, source: source});
            } catch (e) {
                // stop the pulsing effect
                setIsLoading(false);
                // @TODO: sentry?
                console.warn("Could not parse live camera list", e)
                return;
            }

            const parsedCams = result.results.map((item) => {
                    const parsedItem = parseWebCOOSAsset(item);
                    if (parsedItem && parsedItem.access === 'public') {
                        return parsedItem;
                    }
                    return null;
                }),
                filteredCams = parsedCams.filter((pc) => pc !== null);

            setCurCameras(filteredCams);
            setIsLoading(false);
        }
        getCurrentCams();
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

    // show the compile time list of cameras or the dynamically loaded one?
    const unsortedCameraList = curCameras.length ? curCameras : parsedMetadata;

    // apply sorting by Status
    const cameraList = unsortedCameraList.sort((a, b) => {
        if (a.status.sortorder === b.status.sortorder)
            return a.label.localeCompare(b.label);
        else
            return a.status.sortorder - b.status.sortorder
    });


    return (
        <Page metadata={metadata} title='Cameras'>
            <Section>
                <SectionHeader>
                    <div className='inline-block'>
                        Cameras
                    </div>
                    {isLoading && <LoadingSpinner extraClasses={'inline-block ml-1 text-primary'}/>}
                </SectionHeader>

                <table className='w-full table-auto'>
                    <thead>
                        <tr className={classNames('bg-primary text-primary-lighter uppercase text-sm leading-normal text-left ', {
                                'animate-pulse': isLoading,
                            })}>
                            <th className='py-3'></th>
                            <th className='py-3 lg:pl-3 pl-1 text-left'>Camera</th>
                            <th className='py-3 lg:px-6 px-2 text-left hidden lg:table-cell'>Data Access Slug</th>
                            <th className='py-3 lg:px-6 px-2 text-center'>Status</th>
                            <th className='py-3 lg:px-6 px-2 text-left'>
                                <span className='lg:hidden'>Range</span>
                                <span className='hidden lg:table-cell'>Starting</span>
                            </th>
                            <th className='py-3 lg:px-6 px-2 text-left hidden lg:table-cell'>Ending</th>
                            <th className='py-3 lg:px-6 px-2 text-left'>Gallery Links</th>
                        </tr>
                    </thead>
                    <tbody className='text-gray-800 text-sm'>
                        {cameraList.map((c, ci) => {
                            return (
                                <tr
                                    key={c.slug}
                                    className={classNames('border-b border-gray-200 hover:bg-gray-200 ', {
                                        'bg-gray-100 ': ci % 2 === 0,
                                        'bg-white': ci % 2 !== 0
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
                                            </a>
                                        </Link>

                                        <div className='font-mono text-xs lg:hidden'>{c.slug}</div>
                                    </td>
                                    <td className='py-3 lg:px-6 px-2 text-left font-mono text-xs hidden lg:table-cell'>
                                        {c.slug}
                                    </td>
                                    <td className='py-3 lg:px-6 px-2 text-center'>
                                        <span
                                            className={classNames(
                                                'group rounded uppercase py-1 relative cursor-help',
                                                c.status.bg,
                                                c.status.fg,
                                                {
                                                    'animate-pulse px-2': c.status.slug === 'live',
                                                    'px-3': c.status.slug !== 'live',
                                                }
                                            )}
                                            style={{ fontSize: '0.7rem' }}
                                        >
                                            {c.status.slug === 'live' && (
                                                <IconSignal
                                                    size={4}
                                                    paddingx={0}
                                                    extraClasses='pr-1 inline-block align-text-top'
                                                />
                                            )}
                                            {c.status.slug}

                                            <span className='hidden group-hover:block absolute -bottom-8 left-0 min-w-max p-1 rounded-sm shadow-xl bg-primary-darker text-white normal-case z-50'>
                                                {c.status.desc}
                                            </span>
                                        </span>
                                    </td>
                                    <td className='py-3 lg:px-6 px-2 text-left text-xs font-mono'>
                                        {isLoading
                                            ? (<LoadingSpinner extraClasses={'inline-block ml-1 text-primary'} />)
                                            :
                                            dateRanges && dateRanges[c.slug] && dateRanges[c.slug].starting && (
                                                <span>
                                                    {formatInTimeZone(
                                                        dateRanges[c.slug].starting,
                                                        'yyyy-MM-dd',
                                                        c.timezone || defaultTimeZone
                                                    )}
                                                </span>
                                            )
                                        }
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
                                        {isLoading
                                            ? (<LoadingSpinner extraClasses={'inline-block ml-1 text-primary'} />)
                                            :
                                            dateRanges && dateRanges[c.slug] && dateRanges[c.slug].ending && (
                                                <span>
                                                    {formatInTimeZone(
                                                        dateRanges[c.slug].ending,
                                                        'yyyy-MM-dd',
                                                        c.timezone || defaultTimeZone
                                                    )}
                                                </span>
                                            )
                                        }
                                    </td>
                                    <td className='py-3 lg:px-6 px-2'>
                                        <div className='flex flex-col gap-1'>
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
                                        </div>
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
    const sanitized = (ro) =>
        Object.fromEntries(
            Object.entries(ro).map((p) => {
                return [p[0], p[1] === undefined ? null : p[1]];
            })
        );

    // pull live metadata from API
    try {
        const cameraMetadataResult = await getAPIAssets(),
            parsedMetadata = cameraMetadataResult.results
                .map((r) => {
                    const parsed = parseWebCOOSAsset(r);
                    if (parsed && parsed?.access === 'public') {
                        return sanitized(parsed);
                    }
                    return null;
                })
                .filter((pm) => pm !== null);

        return {
            props: {
                metadata: await getSiteMetadata(),
                parsedMetadata: parsedMetadata,
            },
        };
    } catch (e) {
        if (e?.name === 'ResponseNotOkError') {
            // https://nextjs.org/docs/api-reference/data-fetching/get-static-props#notfound
            return {
                notFound: true,
            };
        }
        throw e;
    }
}
