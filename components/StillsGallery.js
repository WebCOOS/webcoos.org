import React, { useEffect, useMemo, useState, useRef } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

export default function StillsGallery({ apiUrl, apiVersion, token, serviceUuid, perPage = 100, galleryClasses = ''}) {
    
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
        results.forEach((result) => {
            curElements = [
                ...curElements.slice(0, result.pagination.start_index - 1),
                ...result.results,
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
    }

    return (
        <>
            <div className="flex gap-2 pb-4">
                {[...Array(visiblePageCount).keys()].map((i) => {
                    return (
                        <div
                            key={i}
                            className={classNames(
                                'cursor-pointer bg-gray-200 w-8 text-center border border-gray-600 rounded-sm text-gray-600',
                                { 'text-red-500': i === viewPage }
                            )}
                            onClick={() => setViewPage(i)}
                        >
                            {i + 1}
                        </div>
                    );
                })}
            </div>

            <div className={classNames("flex gap-1 sm:gap-4 flex-wrap overflow-y-auto", galleryClasses)}>
                {visible.map((still, i) => {
                    return (
                        <img
                            key={still.uuid}
                            className="sm:rounded cursor-pointer"
                            src={still.data.properties.url}
                            alt={still.data.extents.temporal.min}
                            width="300"
                            height="200"
                            onClick={() => setZoomedIdx(i + (viewPage * perPage))}
                        />
                    );
                })}
            </div>

            {zoomed && (
                <div className="fixed z-10 inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center overflow-hidden transition">
                    <div className="bg-white sm:rounded-lg shadow-xl sm:max-w-75w flex flex-row items-stretch">
                        <div
                            className={classNames('w-16 flex items-center justify-center', {
                                'text-gray-600 hover:text-gray-700 hover:bg-gray-400 cursor-pointer hover:rounded-tl-lg hover:rounded-bl-lg':
                                    zoomedIdx > 0,
                                'text-gray-200 cursor-not-allowed': zoomedIdx === 0,
                            })}
                            onClick={() => incZoomIdx(-1)}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                            </svg>
                        </div>
                        <div>
                            <img
                                className="sm:py-8 object-contain"
                                src={zoomed.data.properties.url}
                                alt={zoomed.data.extents.temporal.min}
                                onClick={() => setZoomedIdx(null)}
                            />
                        </div>
                        <div
                            className={classNames('w-16 flex items-center justify-center', {
                                'text-gray-600 hover:text-gray-700 hover:bg-gray-400 cursor-pointer hover:rounded-tr-lg hover:rounded-br-lg': canZoomNext(),
                                'text-gray-200 cursor-not-allowed': canZoomNext(),
                            })}
                            onClick={() => incZoomIdx(1)}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

StillsGallery.propTypes = {
   apiUrl: PropTypes.string,
   apiVersion: PropTypes.string,
   token: PropTypes.string,
   serviceUuid: PropTypes.string,
   perPage: PropTypes.number,
   galleryClasses: PropTypes.string
}
