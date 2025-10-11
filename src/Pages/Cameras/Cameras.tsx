import { useState, useMemo, useContext, type ReactElement } from 'react';

import Page from '@Components/Page';
import Section from '@Components/Section/Section';
import SectionHeader from '@Components/Section/SectionHeader';

import { toZonedTime, format } from 'date-fns-tz';
import { SortedIcon } from '@Components/SortedIcon';
import { IconCamera, IconVideoCamera, IconSignal } from '@Components/Icon';
import { get as pointerGet } from 'json-pointer';
import SiteContext from '@/state/SiteContext';
import type { Product, Products } from '@/types/yaml/products';
import type { IWebCOOSParsedAsset } from '@/services/assets/types';
import ApiContext from '@/state/ApiContext';
import { utils, ViewWithLoader } from '@axdspub/axiom-ui-utilities';
import { Link } from 'react-router';
import { useWebCOOSAssets } from '@/services/assets/useWebCOOSAssets';
import { useYAML } from '@/services/yaml/hooks/useYAML';

const formatInTimeZone = (date: string | number, fmt: string, tz: string) => format(toZonedTime(date, tz), fmt, { timeZone: tz });

const THENBY_SEP = '..';
const SORT_BY_LABEL = '/label';
const SORT_BY_SLUG = '/slug';
const SORT_BY_STATUS_THEN_LABEL = `/status/sortorder${THENBY_SEP}${SORT_BY_LABEL}`;
const SORT_BY_STARTING = '/dateBounds/0';
const SORT_BY_ENDING = '/dateBounds/1';
const SORT_BY_RANGE = SORT_BY_STARTING;
const SORT_BY_GEOGRAPHY = `/geography/region${THENBY_SEP}/geography/state${THENBY_SEP}${SORT_BY_LABEL}`;
const DEFAULT_SORT = SORT_BY_STATUS_THEN_LABEL;

function Cameras(
    { 
        parsedMetadata, 
        products 
    }: {
        parsedMetadata: IWebCOOSParsedAsset[];
        products: Product[]
    }) {
    const metadata = useContext(SiteContext);
    console.log(metadata)



    const defaultTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/New_York';
    const [curCameras] = useState<IWebCOOSParsedAsset[]>(parsedMetadata.slice());
    const [geographyFilter, setGeographyFilter] = useState('');
    const [productFilter, setProductFilter] = useState('');
    const [imageryTypeFilter, setImageryTypeFilter] = useState('');

    // Setting sortedBy and sort direction in single state function
    const [[sortedBy, isSortDirectionAscending], setSortedByAndIsDirectionAscending] = useState([DEFAULT_SORT, true]);


    // Extract geography information for filtering
    const geographies = useMemo(() => {
        const geo = {
            'IOOS Regions': new Set<string>(),
            States: new Set<string>(),
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
        const productCounts: Record<string, number> = {};
        const cameraList = curCameras.length ? curCameras : parsedMetadata;

        cameraList.forEach((camera) => {
            if (camera.products) {
                camera.products.forEach((product) => {
                    if(product !== null){
                        productCounts[product] = (productCounts[product] || 0) + 1;
                    }
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
        const sortedCameraList = [...(curCameras.length ? curCameras : parsedMetadata)];

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
                const sorts = [...thenby_split];

                let ret = 0;

                // Return the first non-zero comparison, for each of the
                // sortable fields, or return zero to reflect equality
                while (sorts.length > 0) {
                    const by = sorts.pop();

                    if(by !== undefined){
                        ret = ('' + pointerGet(a, by)).localeCompare('' + pointerGet(b, by));

                        if (ret !== 0) {
                            return ret;
                        }
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
        if (imageryTypeFilter) {
            cameras = cameras.filter((c) => {
                if (imageryTypeFilter === 'live') {
                    return c.has_live_stream;
                }
                if (imageryTypeFilter === 'video') {
                    return c.has_archived_video;
                }
                if (imageryTypeFilter === 'snapshots') {
                    return c.has_archived_images && !c.has_live_stream && !c.has_archived_video;
                }
                return true;
            });
        }
        return cameras;
    }, [sortMemo, geographyFilter, productFilter, imageryTypeFilter]);

    // Helper function, calls the useState updater with the correct sort field
    // and, if we're already sorting on the desired sorting field, then invert
    // the sort order
    const updateSortStateForSortableHeader = (
        currentlySortedBy: string,
        desiredSortedBy: string,
        currentlyIsSortedDirectionAscending: boolean
    ) => {
        return setSortedByAndIsDirectionAscending([
            desiredSortedBy,
            currentlySortedBy === desiredSortedBy
                ? !currentlyIsSortedDirectionAscending
                : currentlyIsSortedDirectionAscending,
        ]);
    };

    return (
        <>
            <title>Cameras | WebCOOS</title>
        
            <Page title='Cameras'>
                <Section>
                    <SectionHeader>
                        <div className='inline-block'>Cameras</div>
                    </SectionHeader>

                    <div className='flex flex-row gap-4 mb-4 sticky bg-white h-14 top-10 z-10 py-4'>
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
                        <div>
                            <label htmlFor='imagery-type-filter' className='mr-2 font-bold text-sm'>
                                Imagery type:
                            </label>
                            <select
                                id='imagery-type-filter'
                                value={imageryTypeFilter}
                                onChange={(e) => setImageryTypeFilter(e.target.value)}
                                className='border border-gray-300 rounded p-1 text-sm'
                            >
                                <option value=''>All</option>
                                <option value='live'>Video - Live stream</option>
                                <option value='video'>Video - Near real time</option>
                                <option value='snapshots'>Snapshots only</option>
                            </select>
                        </div>
                    </div>

                    <table className='w-full table-auto'>
                        <thead className='sticky top-24 bg-primary-lighter z-10 shadow-md'>
                            <tr
                                className={utils.makeClassName(
                                    {
                                        defaultClassName: 'bg-primary text-primary-lighter uppercase text-sm leading-normal text-left ',
                                        extras: [
                                            
                                        ]
                                    }
                                )}
                            >
                                <th className='py-2 pl-1 lg:pl-2'></th>
                                <th className='py-2 pl-1 lg:pl-2 text-left'>
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
                                <th className='py-2 px-1 lg:px-2 text-left hidden md:table-cell'>
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
                                <th className='py-2 px-1 lg:px-2 text-left hidden md:table-cell'>
                                    <span className='uppercase text-sm leading-normal font-bold'>Products</span>
                                </th>
                                <th className='py-2 px-1 lg:px-2 text-left hidden lg:table-cell'>
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

                                <th className='py-2 px-1 lg:px-2 text-center'>
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
                                <th className='py-2 px-1 lg:px-2 text-left'>
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
                                <th className='py-2 px-1 lg:px-2 text-left hidden lg:table-cell'>
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
                                <th className='py-2 px-1 lg:px-2 text-left'>Gallery Links</th>
                            </tr>
                        </thead>
                        <tbody className='text-gray-800 text-sm'>
                            {sortedAndFilteredCameraList.map((c, ci) => {
                                return (
                                    <tr
                                        key={c.slug}
                                        className={utils.makeClassName({
                                            className: 'border-b border-gray-200 hover:bg-gray-200 cursor-pointer', 
                                            extras: [
                                                ci % 2 === 0 ? 'bg-gray-100 ' : 'bg-white',
                                            ]

                                        })}
                                        onClick={(e) => {
                                            // Check if the click target is within the gallery links column (last column)
                                            const target = e.target as HTMLTableCellElement;
                                            //const galleryCell = target.closest('td:last-child');
                                            
                                             const galleryCell = target.closest('td:last-child');

                                            // If click is not in gallery links column, navigate to camera page
                                            if (!galleryCell) {
                                                window.location.href = `/cameras/${c.slug}`;
                                            }
                                        }}
                                    >
                                        <td className='py-2 pl-1 lg:pl-2 text-left align-middle'>
                                            {c.thumbnails && (c.thumbnails.rect_small || c.thumbnails.square_small) && (
                                                <img
                                                    src={c.thumbnails.rect_small || c.thumbnails.square_small}
                                                    alt={c.label}
                                                    className='w-24 lg:w-40 rounded shadow'
                                                    onError={(e) => {
                                                        // If rect_small fails, try square_small as fallback
                                                        const img = e.target as HTMLImageElement;
                                                        if (
                                                            img.src === c.thumbnails.rect_small &&
                                                            c.thumbnails.square_small
                                                        ) {
                                                            img.src = c.thumbnails.square_small;
                                                        } else {
                                                            // If both fail, hide the image and show placeholder
                                                            const nextElement = img.nextElementSibling as HTMLElement
                                                            if (nextElement !== null) {
                                                                img.style.display = 'none';
                                                                nextElement.style.display = 'flex';
                                                            }
                                                        }
                                                        
                                                    }}
                                                />
                                            )}
                                            <div
                                                className={`w-24 h-16 lg:w-40 lg:h-24 bg-gray-100 rounded shadow flex items-center justify-center border-2 border-dashed border-gray-300 ${
                                                    c.thumbnails && (c.thumbnails.rect_small || c.thumbnails.square_small)
                                                        ? 'hidden'
                                                        : ''
                                                }`}
                                            >
                                                <div className='text-center text-gray-500 text-xs px-2'>
                                                    <div className='mb-1'>
                                                        <IconCamera size={4} extraClasses='mx-auto' paddingx={0} />
                                                    </div>
                                                    <div className='font-medium'>No Image</div>
                                                    <div className='text-gray-400'>Available</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className='py-2 pl-1 lg:pl-2 text-left align-middle'>
                                            <Link to={`/cameras/${c.slug}`} className='text-primary hover:text-primary-darker hover:underline'>
                                                
                                                    <div className='max-w-xs'>{c.label}</div>
                                                
                                            </Link>

                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigator.clipboard.writeText(c.slug);
                                                }}
                                                className='font-mono text-xs lg:hidden text-primary hover:text-primary-darker hover:bg-gray-100 px-2 py-1 rounded transition-colors duration-200 cursor-copy'
                                                title='Click to copy slug to clipboard'
                                            >
                                                {c.slug}
                                            </button>
                                        </td>
                                        <td className='py-2 px-1 lg:px-2 text-left text-xs align-middle hidden md:table-cell'>
                                            {c.geography?.region && (
                                                <div className='font-bold'>{c.geography.region.toUpperCase()}</div>
                                            )}
                                            {c.geography?.state && <div>{c.geography.state}</div>}
                                        </td>
                                        <td className='py-2 px-1 lg:px-2 align-middle hidden md:table-cell'>
                                            <div className='flex flex-row space-x-2'>
                                                {c.products &&
                                                    products &&
                                                    c.products.map((p_slug) => {
                                                        const product = products.find((pr) => pr.slug === p_slug);
                                                        if (!product) return null;
                                                        return (
                                                            <div key={p_slug} title={product.label}>
                                                                <div className='flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full border border-gray-300'>
                                                                    <img
                                                                        src={product.image}
                                                                        alt={product.label}
                                                                        className='w-5 h-5'
                                                                    />
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                            </div>
                                        </td>
                                        <td className='py-2 px-1 lg:px-2 text-left font-mono text-xs hidden lg:table-cell align-middle'>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigator.clipboard.writeText(c.slug);
                                                }}
                                                className='text-primary hover:text-primary-darker hover:bg-gray-100 px-2 py-1 rounded transition-colors duration-200 cursor-copy'
                                                title='Click to copy slug to clipboard'
                                            >
                                                {c.slug}
                                            </button>
                                        </td>
                                        <td className='py-2 px-1 lg:px-2 text-center align-middle'>
                                            <span
                                                className={utils.makeClassName({
                                                    className: 'group rounded uppercase py-1 relative cursor-help',
                                                    extras: [
                                                    c.status.bg,
                                                    c.status.fg,
                                                    c.status.slug === 'live' ? 'animate-pulse px-2': 'px-3'
                                                    ]
                                                })}
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
                                        <td className='py-2 px-1 lg:px-2 text-left text-xs font-mono align-middle'>
                                            {
                                                dateRanges &&
                                                dateRanges[c.slug] &&
                                                dateRanges[c.slug].starting && (
                                                    <span>
                                                        {formatInTimeZone(
                                                            Number(dateRanges[c.slug].starting),
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
                                                            Number(dateRanges[c.slug].ending),
                                                            'yyyy-MM-dd',
                                                            c.timezone || defaultTimeZone
                                                        )}
                                                    </span>
                                                )}
                                            </span>
                                        </td>
                                        <td className='py-2 px-1 lg:px-2 text-left font-mono text-xs hidden lg:table-cell align-middle'>
                                            {
                                                dateRanges &&
                                                dateRanges[c.slug] &&
                                                dateRanges[c.slug].ending && (
                                                    <span>
                                                        {formatInTimeZone(
                                                            Number(dateRanges[c.slug].ending),
                                                            'yyyy-MM-dd',
                                                            c.timezone || defaultTimeZone
                                                        )}
                                                    </span>
                                                )
                                            }
                                        </td>
                                        <td className='py-2 px-1 lg:px-2 align-middle'>
                                            <div className='flex flex-col gap-1'>
                                                {c.galleryServices.map((cameraSvcProps) => {
                                                    return (
                                                        <Link
                                                            key={cameraSvcProps.common.slug}
                                                            to={`/cameras/${c.slug}?gallery=${cameraSvcProps.common.slug}`}
                                                            className='truncate inline hover:text-primary-darker hover:underline text-primary text-xs'
                                                        >
                                                            
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
                                                                <span className='hidden md:inline'>
                                                                    {cameraSvcProps.common.label}
                                                                </span>
                                                            
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
        </>
    );
}

const CamerasLoader = (): ReactElement => {
    const apiContext = useContext(ApiContext)
    const { data, isLoading, error } = useWebCOOSAssets({
        token: apiContext.token,
        apiUrl: apiContext.apiUrl
    })
    const { data: products, isLoading: productsLoading, error: productsError } = useYAML<Products>({ yamlFile: '/yaml_content/products.yaml' })
    return (    
       <ViewWithLoader isLoading={isLoading || productsLoading} error={error || productsError} data={data !== undefined && products !== undefined ? data : undefined}>
           {data !== undefined && products !== undefined && <Cameras parsedMetadata={data} products={products?.sections.products ?? []} />}
       </ViewWithLoader>
    )
}

export default CamerasLoader