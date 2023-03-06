import React, { useState, useEffect, useMemo } from 'react';

import { Section, SectionHeader } from '@axdspub/landing-page-components';
import Page from '../../components/Page';

import { getSiteMetadata } from '../../utils';
import { useAPIContext } from '../../components/contexts/ApiContext';
import { parseWebCOOSAsset, getAPIAssets } from '../../components/utils/webCOOSHelpers';
import classNames from 'classnames';
import { utcToZonedTime, format } from 'date-fns-tz';
import { SortedIcon } from '../../components/SortedIcon';
import { IconCamera, IconVideoCamera, IconSignal } from '../../components/Icon';
import LoadingSpinner from '../../components/LoadingSpinner';
import { get as pointerGet } from 'json-pointer';

import Link from 'next/link';

const formatInTimeZone = (date, fmt, tz) => format(utcToZonedTime(date, tz), fmt, { timeZone: tz });

const THENBY_SEP='..';
const SORT_BY_LABEL='/label';
const SORT_BY_SLUG='/slug';
const SORT_BY_STATUS_THEN_LABEL=`/status/sortorder${THENBY_SEP}${SORT_BY_LABEL}`;
const SORT_BY_STARTING='/dateBounds/0';
const SORT_BY_ENDING='/dateBounds/1';
const SORT_BY_RANGE=SORT_BY_STARTING;
const DEFAULT_SORT=SORT_BY_STATUS_THEN_LABEL;

export default function Cameras({ metadata, parsedMetadata }) {
    const { apiUrl, apiVersion, token, source } = useAPIContext();

    const defaultTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/New_York';
    const [isLoading, setIsLoading] = useState(true);
    const [curCameras, setCurCameras] = useState([]);

    // Setting sortedBy and sort direction in single state function
    const [
        [ sortedBy, isSortDirectionAscending ],
        setSortedByAndIsDirectionAscending
    ] = useState( [ DEFAULT_SORT, true ] );

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

    const sortMemo = useMemo(() => {
        // Copy so that we can sort and filter (without mutating original).
        let sortedCameraList = [...unsortedCameraList];

        let tempSortedBy = sortedBy;

        if( !tempSortedBy ) {
            // Default to status.slug
            tempSortedBy = DEFAULT_SORT;
        }

        try {
            // Attempt a json-pointer get on the first elemtn to ensure we don't
            // have programmer error
            if( sortedCameraList.length > 0 ) {

                pointerGet( sortedCameraList[0], tempSortedBy );
            }
        } catch {
            console.warn(
                `Unable to sort on ${tempSortedBy}, defaulting to ${DEFAULT_SORT}`
            )
            tempSortedBy = DEFAULT_SORT;
        }

        try {

            // Split by the THENBY_SEP in order to get the order in which we
            // should sort the elements
            const thenby_split = tempSortedBy.split( THENBY_SEP ).reverse();

            sortedCameraList.sort(
                (a,b) => {

                    let sorts = [...thenby_split];

                    let ret = 0;

                    // Return the first non-zero comparison, for each of the
                    // sortable fields, or return zero to reflect equality
                    while( sorts.length > 0 ) {

                        const by = sorts.pop();

                        ret = (
                            '' + pointerGet( a, by )
                        ).localeCompare(
                            ('' + pointerGet( b, by ) )
                        );

                        if( ret !== 0 ) {
                            return ret;
                        }
                    }

                    return ret;
                }
            );

        } catch(error) {
            console.warn(
                `Error occurred during asset sort, leaving unsorted: ${error}`
            )
        }

        // Finally, reverse if that is indicated by state
        if( !isSortDirectionAscending ) {
            sortedCameraList.reverse();
        }

        return sortedCameraList

    }, [ unsortedCameraList, sortedBy, isSortDirectionAscending ] )

    // Helper function, calls the useState updater with the correct sort field
    // and, if we're already sorting on the desired sorting field, then invert
    // the sort order
    const updateSortStateForSortableHeader = (
        currentlySortedBy,
        desiredSortedBy,
        currentlyIsSortedDirectionAscending
    ) => {
        return setSortedByAndIsDirectionAscending(
            [
                desiredSortedBy,
                (
                    currentlySortedBy === desiredSortedBy
                    ? !currentlyIsSortedDirectionAscending
                    : currentlyIsSortedDirectionAscending
                )
            ]
        );
    }

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
                            <th className='py-3 lg:pl-3 pl-1 text-left'>
                                <button
                                    type="button"
                                    onClick={() => updateSortStateForSortableHeader( sortedBy, SORT_BY_LABEL, isSortDirectionAscending )}
                                    className="flex items-center uppercase text-sm leading-normal font-bold"
                                >
                                    Camera
                                    <SortedIcon/>
                                </button>
                            </th>
                            <th className='py-3 lg:px-6 px-2 text-left hidden lg:table-cell'>
                                <button
                                    type="button"
                                    onClick={() => updateSortStateForSortableHeader( sortedBy, SORT_BY_SLUG, isSortDirectionAscending )}
                                    className="flex items-center uppercase text-sm leading-normal font-bold"
                                >
                                    Data Access Slug
                                    <SortedIcon/>
                                </button>
                            </th>

                            <th className='py-3 lg:px-6 px-2 text-center'>

                                <button
                                    type="button"
                                    onClick={() => updateSortStateForSortableHeader( sortedBy, SORT_BY_STATUS_THEN_LABEL, isSortDirectionAscending )}
                                    className="flex items-center uppercase text-sm leading-normal font-bold"
                                >
                                    Status
                                    <SortedIcon/>
                                </button>
                            </th>
                            <th className='py-3 lg:px-6 px-2 text-left'>
                                <span className='lg:hidden'>
                                    <button
                                        type="button"
                                        onClick={() => updateSortStateForSortableHeader( sortedBy, SORT_BY_RANGE, isSortDirectionAscending )}
                                        className="flex items-center uppercase text-sm leading-normal font-bold"
                                    >
                                        Range
                                        <SortedIcon/>
                                    </button>
                                </span>
                                <span className='hidden lg:table-cell'>
                                    <button
                                        type="button"
                                        onClick={() => updateSortStateForSortableHeader( sortedBy, SORT_BY_STARTING, isSortDirectionAscending )}
                                        className="flex items-center uppercase text-sm leading-normal font-bold"
                                    >
                                        Starting
                                        <SortedIcon/>
                                    </button>
                                </span>
                            </th>
                            <th className='py-3 lg:px-6 px-2 text-left hidden lg:table-cell'>
                                <button
                                        type="button"
                                        onClick={() => updateSortStateForSortableHeader( sortedBy, SORT_BY_ENDING, isSortDirectionAscending )}
                                        className="flex items-center uppercase text-sm leading-normal font-bold"
                                    >
                                        Ending
                                        <SortedIcon/>
                                    </button>
                            </th>
                            <th className='py-3 lg:px-6 px-2 text-left'>Gallery Links</th>
                        </tr>
                    </thead>
                    <tbody className='text-gray-800 text-sm'>
                        {sortMemo.map((c, ci) => {
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
