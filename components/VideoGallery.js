import React, { useEffect, useMemo, useState, useRef } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import KeyboardEventHandler from 'react-keyboard-event-handler';

export default function VideoGallery({ apiUrl, apiVersion, token, serviceUuid, perPage = 100, galleryClasses = '' }) {
    // data from api state
    const elements = useRef();
    const [apiCount, setApiCount] = useState(0); // count of total number of elements of the API collection, set when first retrieved
    const apiPerPage = useRef();

    // view state
    const [viewPage, setViewPage] = useState(0); // current page being viewed
    const [visible, setVisible] = useState([]); // visible elements
    const [zoomedIdx, setZoomedIdx] = useState(null);

    const updateElements = (results) => {
        let curElements = Array.from(elements.current || []);

        if (!curElements || curElements.length === 0) {
            curElements = new Array(results[0].pagination.count).fill(null);
        }

        // set the curelements array each time
        const dtFormatter = new Intl.DateTimeFormat(undefined, {
            dateStyle: 'medium',
            timeStyle: 'medium',
        });
        results.forEach((result) => {
            const parsedResults = result.results.map((r) => {
                const dt = new Date(Date.parse(r.data.extents.temporal.min));
                return {
                    uuid: r.uuid,
                    data: {
                        ...r.data,
                        dateTime: dt,
                        dateTimeStr: dtFormatter.format(dt),
                    },
                };
            });
            curElements = [
                ...curElements.slice(0, result.pagination.start_index - 1),
                ...parsedResults,
                ...curElements.slice(result.pagination.end_index),
            ];
        });
        elements.current = curElements;
        return curElements;
    };

    useEffect(() => {
        // @property    pageNum     0-based API page number.
        // @return                  A promise (from fetch).
        const getElements = (pageNum = 0) => {
            return fetch(`${apiUrl}/${apiVersion}/elements/?service=${serviceUuid}&page=${pageNum + 1}`, {
                headers: {
                    Authorization: `Token ${token}`,
                    Accept: 'application/json',
                },
            });
        };

        const maybeFetch = async () => {
            let curApiCount = apiCount,
                // curApiPerPage = apiPerPage.current,
                newElemResults = [],
                initialSet = false,
                curElements = Array.from(elements.current || []);

            // have we had a response from the API yet?  if not, we don't know how many items per page.
            // we need this to figure out which backend pages to get.
            if (!apiPerPage.current) {
                const response = await getElements(0),
                    result = await response.json();

                curApiCount = result.pagination.count;

                // always update the ref vars immediately
                apiPerPage.current = result.pagination.end_index - result.pagination.start_index + 1;
                newElemResults.push(result);

                // it's the initial, by definition elements isnt set and we need to look at it for available data in a second.
                curElements = new Array(result.pagination.count).fill(null);
                curElements.splice(0, result.results.length, ...result.results);

                initialSet = true;
            }

            // translate a VISIBLE page number into a slice offset into elements
            const startIdx = viewPage * perPage,
                endIdx = startIdx + perPage;

            // map over element range, if element at the index is null transform into api page number to get
            const range = Array.from({ length: endIdx - startIdx }, (_, i) => startIdx + i),
                pagesNeeded = new Set(
                    range
                        .map((i) => (curElements[i] === null ? Math.floor(i / apiPerPage.current) : null))
                        .filter((i) => i !== null)
                );

            if (pagesNeeded.size > 0) {
                const allResultsProm = Promise.all(
                    Array.from(pagesNeeded).map(async (pageNum) => {
                        const response = await getElements(pageNum);
                        return await response.json();
                    })
                );

                const allResults = await allResultsProm;
                // extend newElemResults with anything new fetched
                newElemResults = [...newElemResults, ...allResults];
            }

            // set all new results into elements
            if (newElemResults.length > 0) {
                curElements = updateElements(newElemResults);
            }

            // at this point, we have all elements loaded, set visibility
            const visible = curElements.slice(startIdx, startIdx + perPage).filter((e) => !!e);
            setVisible(visible);

            // update state vars if needed
            if (initialSet) {
                setApiCount(curApiCount);
            }
        };

        maybeFetch();
    }, [elements, viewPage, perPage, apiCount, apiUrl, apiVersion, serviceUuid, token]);

    // calculate visible page count based on visible perpage/api count
    const visiblePageCount = useMemo(() => {
        return Math.floor(apiCount / perPage) + (apiCount % perPage > 0 ? 1 : 0);
    }, [perPage, apiCount]);

    const zoomed = useMemo(() => {
        if (zoomedIdx === null) {
            return null;
        }

        if (zoomedIdx < 0 || zoomedIdx >= elements.current.length) {
            return null;
        }

        return elements.current[zoomedIdx];
    }, [zoomedIdx, elements]);

    const incZoomIdx = (direction) => {
        setZoomedIdx((cur) => {
            if (cur === null) {
                return cur;
            }

            const newIdx = cur + direction;
            if (newIdx < 0 || newIdx >= elements.current.length) {
                return cur;
            }

            return newIdx;
        });
    };

    const canZoomNext = () => {
        return elements.current && zoomedIdx !== null && zoomedIdx < elements.current.length - 1;
    };

    const incViewPage = (direction) => {
        setViewPage((cur) => {
            const newPage = cur + direction;
            if (newPage < 0 || newPage >= visiblePageCount) {
                return cur;
            }
            return newPage;
        });
    };

    const onKey = (key, e) => {
        if (key === 'esc') {
            setZoomedIdx(null);
        } else if (key === 'left') {
            incZoomIdx(-1);
        } else if (key === 'right') {
            incZoomIdx(1);
        }
    };

    return (
        <>
            <nav className='relative z-0 flex justify-center rounded-md -space-x-px' aria-label='Pagination'>
                <button
                    className={classNames(
                        'relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium',
                        {
                            'hover:bg-gray-50 cursor-pointer text-gray-500': viewPage > 0,
                            'cursor-default text-gray-200': viewPage === 0,
                        }
                    )}
                    onClick={() => incViewPage(-1)}
                >
                    <span className='sr-only'>Previous</span>
                    <svg
                        className='h-5 w-5'
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 0 20 20'
                        fill='currentColor'
                        aria-hidden='true'
                    >
                        <path
                            fillRule='evenodd'
                            d='M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z'
                            clipRule='evenodd'
                        />
                    </svg>
                </button>
                <div className='relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700'>
                    <span className='font-semibold w-6 text-right'>{viewPage + 1}</span>
                    <span className='mx-1'>of</span>
                    <span className='font-semibold w-6 text-left'>{visiblePageCount}</span>
                </div>

                <button
                    className={classNames(
                        'relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium',
                        {
                            'hover:bg-gray-50 cursor-pointer text-gray-500': viewPage + 1 < visiblePageCount,
                            'cursor-default text-gray-200': viewPage + 1 >= visiblePageCount,
                        }
                    )}
                    onClick={() => incViewPage(1)}
                >
                    <span className='sr-only'>Next</span>
                    <svg
                        className='h-5 w-5'
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 0 20 20'
                        fill='currentColor'
                        aria-hidden='true'
                    >
                        <path
                            fillRule='evenodd'
                            d='M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z'
                            clipRule='evenodd'
                        />
                    </svg>
                </button>
            </nav>

            <div
                className={classNames(
                    'flex gap-1 mt-4 sm:gap-4 flex-wrap overflow-y-auto justify-center',
                    galleryClasses
                )}
            >
                {visible.map((still, i) => {
                    return (
                        <div className='relative'>
                            <img
                                key={still.uuid}
                                className='sm:rounded cursor-pointer'
                                src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAoAAAAFICAYAAADAnk9nAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAFHGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDIgNzkuMTYwOTI0LCAyMDE3LzA3LzEzLTAxOjA2OjM5ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDE4LTA5LTIxVDA5OjA1OjQyLTA3OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAxOC0wOS0yMVQwOToyMDozNC0wNzowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAxOC0wOS0yMVQwOToyMDozNC0wNzowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo2NDM1Y2FkYS0zYmYw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 '
                                alt={still.data.dateTimeStr}
                                width='300'
                                height='200'
                                onClick={() => setZoomedIdx(i + viewPage * perPage)}
                            />

                            <div className='absolute bg-primary text-white border border-primary-darker p-1 bottom-1 right-1 text-xs bg-opacity-60 rounded'>
                                {still.data.dateTimeStr}
                            </div>
                        </div>
                    );
                })}
            </div>

            {zoomed && (
                <>
                    <KeyboardEventHandler handleKeys={['esc', 'left', 'right']} onKeyEvent={onKey} />
                    <div className='fixed z-10 inset-0 bg-gray-500 bg-opacity-75 flex flex-col items-center justify-center overflow-hidden transition'>
                        <div className='bg-white sm:rounded-lg shadow-xl sm:max-w-75w flex flex-row items-stretch'>
                            <div
                                className={classNames('w-16 flex items-center justify-center', {
                                    'text-gray-600 hover:text-gray-700 hover:bg-gray-400 cursor-pointer hover:rounded-tl-lg hover:rounded-bl-lg':
                                        zoomedIdx > 0,
                                    'text-gray-200 cursor-not-allowed': zoomedIdx === 0,
                                })}
                                onClick={() => incZoomIdx(-1)}
                            >
                                <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    className='h-6 w-6'
                                    fill='none'
                                    viewBox='0 0 24 24'
                                    stroke='currentColor'
                                    strokeWidth={2}
                                >
                                    <path
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        d='M11 17l-5-5m0 0l5-5m-5 5h12'
                                    />
                                </svg>
                            </div>
                            <div className='flex flex-col sm:pt-6 sm:pb-2'>
                                <video className='object-contain' controls onClick={() => setZoomedIdx(null)}>
                                    <source src={zoomed.data.properties.url} type='video/mp4' />
                                </video>

                                <div className='pt-4'>{zoomed.data.dateTimeStr}</div>
                            </div>
                            <div
                                className={classNames('w-16 flex items-center justify-center', {
                                    'text-gray-600 hover:text-gray-700 hover:bg-gray-400 cursor-pointer hover:rounded-tr-lg hover:rounded-br-lg': canZoomNext(),
                                    'text-gray-200 cursor-not-allowed': !canZoomNext(),
                                })}
                                onClick={() => incZoomIdx(1)}
                            >
                                <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    className='h-6 w-6'
                                    fill='none'
                                    viewBox='0 0 24 24'
                                    stroke='currentColor'
                                    strokeWidth={2}
                                >
                                    <path strokeLinecap='round' strokeLinejoin='round' d='M13 7l5 5m0 0l-5 5m5-5H6' />
                                </svg>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}

VideoGallery.propTypes = {
    apiUrl: PropTypes.string,
    apiVersion: PropTypes.string,
    token: PropTypes.string,
    serviceUuid: PropTypes.string,
    perPage: PropTypes.number,
    galleryClasses: PropTypes.string,
};
