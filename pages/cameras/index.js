import React, { useState, useEffect, useMemo } from 'react';

import { Section, SectionHeader } from '@axdspub/landing-page-components';
import Page from '../../components/Page';

import { getSiteMetadata, getYaml } from '../../utils';
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

const THENBY_SEP = '..';
const SORT_BY_LABEL = '/label';
const SORT_BY_SLUG = '/slug';
const SORT_BY_STATUS_THEN_LABEL = `/status/sortorder${THENBY_SEP}${SORT_BY_LABEL}`;
const SORT_BY_STARTING = '/dateBounds/0';
const SORT_BY_ENDING = '/dateBounds/1';
const SORT_BY_RANGE = SORT_BY_STARTING;
const SORT_BY_GEOGRAPHY = `/geography/region${THENBY_SEP}/geography/state${THENBY_SEP}${SORT_BY_LABEL}`;
const DEFAULT_SORT = SORT_BY_STATUS_THEN_LABEL;

export default function Cameras({ metadata, parsedMetadata, products }) {
    const { apiUrl, apiVersion, token, source } = useAPIContext();

    // Debug logging for component props
    console.log('Cameras component props:', {
        productsCount: products?.length || 0,
        products: products,
        parsedMetadataCount: parsedMetadata?.length || 0,
    });

    const defaultTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/New_York';
    const [isLoading, setIsLoading] = useState(true);
    const [curCameras, setCurCameras] = useState([]);
    const [geographyFilter, setGeographyFilter] = useState('');
    const [productFilter, setProductFilter] = useState('');

    // Setting sortedBy and sort direction in single state function
    const [[sortedBy, isSortDirectionAscending], setSortedByAndIsDirectionAscending] = useState([DEFAULT_SORT, true]);

    useEffect(() => {
        const getCurrentCams = async () => {
            let result;

            try {
                result = await getAPIAssets({ apiUrl: apiUrl, apiVersion: apiVersion, token: token, source: source });
            } catch (e) {
                // stop the pulsing effect
                setIsLoading(false);
                // @TODO: sentry?
                console.warn('Could not parse live camera list', e);
                return;
            }

            // Log raw API response structure for debugging
            if (result.results.length > 0) {
                const sampleItem = result.results[0];
                console.log('Raw API response sample:', {
                    feeds: sampleItem.feeds?.length || 0,
                    sampleFeed: sampleItem.feeds?.[0]
                        ? {
                              products: sampleItem.feeds[0].products?.length || 0,
                              sampleProduct: sampleItem.feeds[0].products?.[0]
                                  ? {
                                        services: sampleItem.feeds[0].products[0].services?.length || 0,
                                        sampleService: sampleItem.feeds[0].products[0].services?.[0]
                                            ? {
                                                  type: sampleItem.feeds[0].products[0].services[0].data.type,
                                                  system: sampleItem.feeds[0].products[0].services[0].data.system,
                                                  common: sampleItem.feeds[0].products[0].services[0].data.common,
                                              }
                                            : null,
                                    }
                                  : null,
                          }
                        : null,
                });
            }

            const parsedCams = result.results.map((item) => {
                    const parsedItem = parseWebCOOSAsset(item);
                    if (parsedItem && parsedItem.access === 'public') {
                        return parsedItem;
                    }
                    return null;
                }),
                filteredCams = parsedCams.filter((pc) => pc !== null);

            // Debug logging for parsed cameras
            console.log('Parsed cameras debug:', {
                totalResults: result.results.length,
                parsedCount: parsedCams.length,
                filteredCount: filteredCams.length,
                sampleCamera: filteredCams[0]
                    ? {
                          label: filteredCams[0].label,
                          products: filteredCams[0].products,
                          servicesCount: filteredCams[0].services?.length,
                      }
                    : null,
            });

            console.log('Available products with counts:', availableProducts);

            // Log available vs defined products
            const availableProductSlugs = new Set(Object.keys(availableProducts));
            const definedProductSlugs = new Set(products.map((p) => p.slug));
            const unusedProducts = [...definedProductSlugs].filter((p) => !availableProductSlugs.has(p));
            console.log('Product availability:', {
                available: availableProductSlugs,
                defined: definedProductSlugs,
                unused: unusedProducts,
                summary: `${availableProductSlugs.size}/${definedProductSlugs.size} products have cameras`,
            });

            setCurCameras(filteredCams);
            setIsLoading(false);
        };
        getCurrentCams();
    }, []);

    // Extract geography information for filtering
    const geographies = useMemo(() => {
        const geo = {
            'IOOS Regions': new Set(),
            States: new Set(),
        };

        const cameraList = curCameras.length ? curCameras : parsedMetadata;

        cameraList.forEach((c) => {
            if (c.geography?.region) {
                geo['IOOS Regions'].add(c.geography.region);
            }
            if (c.geography?.state) {
                geo['States'].add(c.geography.state);
            }
        });

        return {
            'IOOS Regions': Array.from(geo['IOOS Regions']).sort(),
            States: Array.from(geo['States']).sort(),
        };
    }, [curCameras, parsedMetadata]);

    // Extract available products for filtering
    const availableProducts = useMemo(() => {
        const productCounts = {};
        const cameraList = curCameras.length ? curCameras : parsedMetadata;

        cameraList.forEach((camera) => {
            if (camera.products) {
                camera.products.forEach((product) => {
                    productCounts[product] = (productCounts[product] || 0) + 1;
                });
            }
        });

        return productCounts;
    }, [curCameras, parsedMetadata]);

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
                    },
                ];
            })
        );
    }, [parsedMetadata, curCameras]);

    // show the compile time list of cameras or the dynamically loaded one?

    const sortMemo = useMemo(() => {
        // Copy so that we can sort and filter (without mutating original).
        let sortedCameraList = [...(curCameras.length ? curCameras : parsedMetadata)];

        let tempSortedBy = sortedBy;

        if (!tempSortedBy) {
            // Default to status.slug
            tempSortedBy = DEFAULT_SORT;
        }

        try {
            // Attempt a json-pointer get on the first elemtn to ensure we don't
            // have programmer error
            if (sortedCameraList.length > 0) {
                pointerGet(sortedCameraList[0], tempSortedBy);
            }
        } catch {
            console.warn(`Unable to sort on ${tempSortedBy}, defaulting to ${DEFAULT_SORT}`);
            tempSortedBy = DEFAULT_SORT;
        }

        try {
            // Split by the THENBY_SEP in order to get the order in which we
            // should sort the elements
            const thenby_split = tempSortedBy.split(THENBY_SEP).reverse();

            sortedCameraList.sort((a, b) => {
                let sorts = [...thenby_split];

                let ret = 0;

                // Return the first non-zero comparison, for each of the
                // sortable fields, or return zero to reflect equality
                while (sorts.length > 0) {
                    const by = sorts.pop();

                    ret = ('' + pointerGet(a, by)).localeCompare('' + pointerGet(b, by));

                    if (ret !== 0) {
                        return ret;
                    }
                }

                return ret;
            });
        } catch (error) {
            console.warn(`Error occurred during asset sort, leaving unsorted: ${error}`);
        }

        // Finally, reverse if that is indicated by state
        if (!isSortDirectionAscending) {
            sortedCameraList.reverse();
        }

        return sortedCameraList;
    }, [curCameras, parsedMetadata, sortedBy, isSortDirectionAscending]);

    const sortedAndFilteredCameraList = useMemo(() => {
        let cameras = [...sortMemo];
        if (geographyFilter) {
            const [type, value] = geographyFilter.split(':');
            cameras = cameras.filter((c) => {
                if (type === 'region') {
                    return c.geography?.region === value;
                }
                if (type === 'state') {
                    return c.geography?.state === value;
                }
                return true;
            });
        }
        if (productFilter) {
            cameras = cameras.filter((c) => c.products && c.products.includes(productFilter));
        }
        return cameras;
    }, [sortMemo, geographyFilter, productFilter]);

    // Helper function, calls the useState updater with the correct sort field
    // and, if we're already sorting on the desired sorting field, then invert
    // the sort order
    const updateSortStateForSortableHeader = (
        currentlySortedBy,
        desiredSortedBy,
        currentlyIsSortedDirectionAscending
    ) => {
        return setSortedByAndIsDirectionAscending([
            desiredSortedBy,
            currentlySortedBy === desiredSortedBy
                ? !currentlyIsSortedDirectionAscending
                : currentlyIsSortedDirectionAscending,
        ]);
    };

    return (
        <Page metadata={metadata} title='Cameras'>
            <Section>
                <SectionHeader>
                    <div className='inline-block'>Cameras</div>
                    {isLoading && <LoadingSpinner extraClasses={'inline-block ml-1 text-primary'} />}
                </SectionHeader>

                <div className='flex flex-row gap-4 mb-4'>
                    <div>
                        <label htmlFor='geography-filter' className='mr-2 font-bold text-sm'>
                            Filter by Geography:
                        </label>
                        <select
                            id='geography-filter'
                            value={geographyFilter}
                            onChange={(e) => setGeographyFilter(e.target.value)}
                            className='border border-gray-300 rounded p-1 text-sm'
                        >
                            <option value=''>All</option>
                            {geographies['IOOS Regions'].length > 0 && (
                                <optgroup label='IOOS Regions'>
                                    {geographies['IOOS Regions'].map((region) => (
                                        <option key={region} value={`region:${region}`}>
                                            {region}
                                        </option>
                                    ))}
                                </optgroup>
                            )}
                            {geographies['States'].length > 0 && (
                                <optgroup label='States'>
                                    {geographies['States'].map((state) => (
                                        <option key={state} value={`state:${state}`}>
                                            {state}
                                        </option>
                                    ))}
                                </optgroup>
                            )}
                        </select>
                    </div>
                    <div>
                        <label htmlFor='product-filter' className='mr-2 font-bold text-sm'>
                            Filter by Product:
                        </label>
                        <select
                            id='product-filter'
                            value={productFilter}
                            onChange={(e) => setProductFilter(e.target.value)}
                            className='border border-gray-300 rounded p-1 text-sm'
                        >
                            <option value=''>All</option>
                            {products
                                .filter((p) => availableProducts[p.slug])
                                .map((p) => (
                                    <option key={p.slug} value={p.slug}>
                                        {p.label} ({availableProducts[p.slug]})
                                    </option>
                                ))}
                        </select>
                    </div>
                </div>

                <table className='w-full table-auto'>
                    <thead>
                        <tr
                            className={classNames(
                                'bg-primary text-primary-lighter uppercase text-sm leading-normal text-left ',
                                {
                                    'animate-pulse': isLoading,
                                }
                            )}
                        >
                            <th className='py-3'></th>
                            <th className='py-3 lg:pl-3 pl-1 text-left'>
                                <button
                                    type='button'
                                    onClick={() =>
                                        updateSortStateForSortableHeader(
                                            sortedBy,
                                            SORT_BY_LABEL,
                                            isSortDirectionAscending
                                        )
                                    }
                                    className='flex items-center uppercase text-sm leading-normal font-bold'
                                >
                                    Camera
                                    <SortedIcon />
                                </button>
                            </th>
                            <th className='py-3 lg:px-6 px-2 text-left'>
                                <button
                                    type='button'
                                    onClick={() =>
                                        updateSortStateForSortableHeader(
                                            sortedBy,
                                            SORT_BY_GEOGRAPHY,
                                            isSortDirectionAscending
                                        )
                                    }
                                    className='flex items-center uppercase text-sm leading-normal font-bold'
                                >
                                    Geography
                                    <SortedIcon />
                                </button>
                            </th>
                            <th className='py-3 lg:px-6 px-2 text-left'>
                                <span className='uppercase text-sm leading-normal font-bold'>Products</span>
                            </th>
                            <th className='py-3 lg:px-6 px-2 text-left hidden lg:table-cell'>
                                <button
                                    type='button'
                                    onClick={() =>
                                        updateSortStateForSortableHeader(
                                            sortedBy,
                                            SORT_BY_SLUG,
                                            isSortDirectionAscending
                                        )
                                    }
                                    className='flex items-center uppercase text-sm leading-normal font-bold'
                                >
                                    Data Access Slug
                                    <SortedIcon />
                                </button>
                            </th>

                            <th className='py-3 lg:px-6 px-2 text-center'>
                                <button
                                    type='button'
                                    onClick={() =>
                                        updateSortStateForSortableHeader(
                                            sortedBy,
                                            SORT_BY_STATUS_THEN_LABEL,
                                            isSortDirectionAscending
                                        )
                                    }
                                    className='flex items-center uppercase text-sm leading-normal font-bold'
                                >
                                    Status
                                    <SortedIcon />
                                </button>
                            </th>
                            <th className='py-3 lg:px-6 px-2 text-left'>
                                <span className='lg:hidden'>
                                    <button
                                        type='button'
                                        onClick={() =>
                                            updateSortStateForSortableHeader(
                                                sortedBy,
                                                SORT_BY_RANGE,
                                                isSortDirectionAscending
                                            )
                                        }
                                        className='flex items-center uppercase text-sm leading-normal font-bold'
                                    >
                                        Range
                                        <SortedIcon />
                                    </button>
                                </span>
                                <span className='hidden lg:table-cell'>
                                    <button
                                        type='button'
                                        onClick={() =>
                                            updateSortStateForSortableHeader(
                                                sortedBy,
                                                SORT_BY_STARTING,
                                                isSortDirectionAscending
                                            )
                                        }
                                        className='flex items-center uppercase text-sm leading-normal font-bold'
                                    >
                                        Starting
                                        <SortedIcon />
                                    </button>
                                </span>
                            </th>
                            <th className='py-3 lg:px-6 px-2 text-left hidden lg:table-cell'>
                                <button
                                    type='button'
                                    onClick={() =>
                                        updateSortStateForSortableHeader(
                                            sortedBy,
                                            SORT_BY_ENDING,
                                            isSortDirectionAscending
                                        )
                                    }
                                    className='flex items-center uppercase text-sm leading-normal font-bold'
                                >
                                    Ending
                                    <SortedIcon />
                                </button>
                            </th>
                            <th className='py-3 lg:px-6 px-2 text-left'>Gallery Links</th>
                        </tr>
                    </thead>
                    <tbody className='text-gray-800 text-sm'>
                        {sortedAndFilteredCameraList.map((c, ci) => {
                            return (
                                <tr
                                    key={c.slug}
                                    className={classNames('border-b border-gray-200 hover:bg-gray-200 ', {
                                        'bg-gray-100 ': ci % 2 === 0,
                                        'bg-white': ci % 2 !== 0,
                                    })}
                                >
                                    <td className='py-3 lg:pl-3 pl-1 text-left align-middle'>
                                        {c.thumbnails && (c.thumbnails.rect_small || c.thumbnails.square_small) && (
                                            <img
                                                src={c.thumbnails.rect_small || c.thumbnails.square_small}
                                                alt={c.label}
                                                className='w-40 rounded shadow'
                                                onError={(e) => {
                                                    // If rect_small fails, try square_small as fallback
                                                    if (
                                                        e.target.src === c.thumbnails.rect_small &&
                                                        c.thumbnails.square_small
                                                    ) {
                                                        e.target.src = c.thumbnails.square_small;
                                                    } else {
                                                        // If both fail, hide the image and show placeholder
                                                        e.target.style.display = 'none';
                                                        e.target.nextSibling.style.display = 'flex';
                                                    }
                                                }}
                                            />
                                        )}
                                        <div
                                            className={`w-40 h-24 bg-gray-100 rounded shadow flex items-center justify-center border-2 border-dashed border-gray-300 ${
                                                c.thumbnails && (c.thumbnails.rect_small || c.thumbnails.square_small)
                                                    ? 'hidden'
                                                    : ''
                                            }`}
                                        >
                                            <div className='text-center text-gray-500 text-xs px-2'>
                                                <div className='mb-1'>
                                                    <IconCamera size={6} extraClasses='mx-auto' paddingx={0} />
                                                </div>
                                                <div className='font-medium'>No Image</div>
                                                <div className='text-gray-400'>Available</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className='py-3 lg:pl-3 pl-1 text-left whitespace-nowrap align-middle'>
                                        <Link href={`/cameras/${c.slug}`}>
                                            <a className='text-primary hover:text-primary-darker hover:underline'>
                                                <span>{c.label}</span>
                                            </a>
                                        </Link>

                                        <div className='font-mono text-xs lg:hidden'>{c.slug}</div>
                                    </td>
                                    <td className='py-3 lg:px-6 px-2 text-left text-xs align-middle'>
                                        {c.geography?.region && (
                                            <div className='font-bold'>{c.geography.region.toUpperCase()}</div>
                                        )}
                                        {c.geography?.state && <div>{c.geography.state}</div>}
                                    </td>
                                    <td className='py-3 lg:px-6 px-2 align-middle'>
                                        <div className='flex flex-row space-x-1'>
                                            {c.products &&
                                                products &&
                                                c.products.map((p_slug) => {
                                                    const product = products.find((pr) => pr.slug === p_slug);
                                                    if (!product) return null;
                                                    return (
                                                        <div key={p_slug} title={product.label}>
                                                            <img
                                                                src={product.image}
                                                                alt={product.label}
                                                                className='w-6 h-6 inline-block'
                                                            />
                                                        </div>
                                                    );
                                                })}
                                        </div>
                                    </td>
                                    <td className='py-3 lg:px-6 px-2 text-left font-mono text-xs hidden lg:table-cell align-middle'>
                                        {c.slug}
                                    </td>
                                    <td className='py-3 lg:px-6 px-2 text-center align-middle'>
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
                                    <td className='py-3 lg:px-6 px-2 text-left text-xs font-mono align-middle'>
                                        {isLoading ? (
                                            <LoadingSpinner extraClasses={'inline-block ml-1 text-primary'} />
                                        ) : (
                                            dateRanges &&
                                            dateRanges[c.slug] &&
                                            dateRanges[c.slug].starting && (
                                                <span>
                                                    {formatInTimeZone(
                                                        dateRanges[c.slug].starting,
                                                        'yyyy-MM-dd',
                                                        c.timezone || defaultTimeZone
                                                    )}
                                                </span>
                                            )
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
                                    <td className='py-3 lg:px-6 px-2 text-left font-mono text-xs hidden lg:table-cell align-middle'>
                                        {isLoading ? (
                                            <LoadingSpinner extraClasses={'inline-block ml-1 text-primary'} />
                                        ) : (
                                            dateRanges &&
                                            dateRanges[c.slug] &&
                                            dateRanges[c.slug].ending && (
                                                <span>
                                                    {formatInTimeZone(
                                                        dateRanges[c.slug].ending,
                                                        'yyyy-MM-dd',
                                                        c.timezone || defaultTimeZone
                                                    )}
                                                </span>
                                            )
                                        )}
                                    </td>
                                    <td className='py-3 lg:px-6 px-2 align-middle'>
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
        const cameraMetadataResult = await getAPIAssets({ allow_cached: false }),
            parsedMetadata = cameraMetadataResult.results
                .map((r) => {
                    const parsed = parseWebCOOSAsset(r);
                    if (parsed && parsed?.access === 'public') {
                        return sanitized(parsed);
                    }
                    return null;
                })
                .filter((pm) => pm !== null);
        const products = await getYaml('products.yaml');

        // Debug logging for products
        console.log('Products loaded:', {
            productsCount: products.sections.products.length,
            products: products.sections.products,
        });

        // Log product type counts for static metadata
        const staticProductCounts = parsedMetadata.reduce((acc, camera) => {
            if (camera.products) {
                camera.products.forEach((product) => {
                    acc[product] = (acc[product] || 0) + 1;
                });
            }
            return acc;
        }, {});
        console.log('Static metadata product type counts:', staticProductCounts);

        return {
            props: {
                metadata: await getSiteMetadata(),
                parsedMetadata: parsedMetadata,
                products: products.sections.products,
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
