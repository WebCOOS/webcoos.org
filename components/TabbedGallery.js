import React, { useEffect, useMemo, useState, useReducer } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { DatePicker, MonthPicker } from '@axds/landing-page-components';
import {
    parseISO,
    startOfDay,
    differenceInDays,
    addMinutes,
    endOfMonth,
    startOfMonth,
    endOfDay,
    getOverlappingDaysInIntervals,
    isWithinInterval,
    addDays,
} from 'date-fns';
import { utcToZonedTime, zonedTimeToUtc, format, } from 'date-fns-tz';
import { useAPIContext } from './contexts/ApiContext';


// extract dates from inventory
// this is only for daily
const getDates = (inv, tz) => {
    let endTransform = (d) => d,
        availIdx = inv.meta.fields.findIndex((f) => f.name === 'has_data'),
        startIdx = inv.meta.fields.findIndex((f) => f.name === 'data_starting'),
        endIdx = inv.meta.fields.findIndex((f) => f.name === 'data_ending');
    if (startIdx === -1) {
        startIdx = inv.meta.fields.findIndex((f) => f.name == 'starting');
    }
    if (endIdx === -1) {
        endIdx = inv.meta.fields.findIndex((f) => f.name == 'ending');
        // if using "ending" the date is exclusive so have to subtract a minute off of it
        endTransform = (d) => addMinutes(d, -1);
    }

    if (!(availIdx !== -1 && startIdx !== -1 && endIdx !== -1)) {
        console.warn('Column search failed:', availIdx, startIdx, endIdx);
        return null;
    }

    // have to convert to string and back because set doesn't think same dates are the same.
    // inside the set everything is in the given timezone.
    const allDates = Array.from(
        new Set(
            inv.values
                // filter to available only
                .filter((dv) => dv[availIdx] === 1)
                // use the actual data boundaries as a beginning and ending, falling back to day boundaries
                .flatMap((dv) => {
                    return [
                        format(startOfDay(utcToZonedTime(parseISO(dv[startIdx]), tz)), 'yyyy-MM-dd', { timezone: tz }),
                        format(startOfDay(utcToZonedTime(endTransform(parseISO(dv[endIdx])), tz)), 'yyyy-MM-dd', {
                            timezone: tz,
                        }),
                    ];
                })
        )
    ).map((t) => zonedTimeToUtc(t, tz));
    allDates.sort((a, b) => a.getTime() - b.getTime());

    return allDates;
}

// extract date ranges from inventory
// this is for monthly
const getDateRanges = (inv, tz) => {
    let availIdx = inv.meta.fields.findIndex((f) => f.name === 'has_data'),
        startIdx = inv.meta.fields.findIndex((f) => f.name == 'starting'),
        endIdx = inv.meta.fields.findIndex((f) => f.name == 'ending');

    if (!(availIdx !== -1 && startIdx !== -1 && endIdx !== -1)) {
        console.warn('Column search failed:', availIdx, startIdx, endIdx);
        return null;
    }

    const allRanges = inv.values.filter(mv => mv[availIdx] === 1).map(mv => {
        return {
            start: parseISO(mv[startIdx]),
            end: endOfDay(parseISO(mv[endIdx])),
        };
    })

    allRanges.sort((a, b) => a.start.getTime() - b.start.getTime());

    return allRanges;
}


const getAvailTimes = (inventory, inventoryName, tz) => {
    const inv = (inventory || []).find((i) => i.name === inventoryName);
    if (!inv) {
        return [];
    }
    if (inventoryName === 'monthly') {
        return getDateRanges(inv, tz);
    }

    return getDates(inv, tz);
};

const getValidTime = (curDate, availTimes, inventoryName) => {
    // no available times?  return given date
    if (availTimes.length === 0) {
        console.debug("getValidTime: no availTimes, returning given date", curDate);
        return curDate;
    }

    if (inventoryName === 'daily') {
        // handle both ranges and single dates
        const date = ('start' in curDate) ? curDate.start : curDate;

        const withData = availTimes.map((v) => {
            return [v, Math.abs(differenceInDays(v, date))];
        });

        withData.sort((a, b) => a[1] - b[1]);
        return withData[0][0];

    } else if (inventoryName === 'monthly') {

        // just a plain date?
        if ('start' in curDate === false) {
            // try to locate a range that includes this day
            const range = availTimes.find((at) => isWithinInterval(curDate, at));
            if (!!range) {
                return range;
            }

            // didn't find one?  find closest one.
            const withData = availTimes.map(at => {
                return [at, Math.min(
                    Math.abs(differenceInDays(at.start, curDate)),
                    Math.abs(differenceInDays(at.end, curDate)),
                )]
            });

            withData.sort((a, b) => a[1] - b[1]);
            return withData[0][0];
        } else {
            // it's a range. figure find out closest range by total difference in days from start and end
            const withData = availTimes.map(at => {
                return [
                    at,
                    Math.abs(differenceInDays(at.start, curDate.start)) +
                        Math.abs(differenceInDays(at.end, curDate.end)),
                ];
            })

            withData.sort((a, b) => a[1] - b[1]);
            return withData[0][0];

        }
    }
    return curDate;
}

/**
 * Reducer used for state of the tabbed gallery.
 * 
 * Necessary because updating the current tab might need to change
 * a lot of state at once, such as the inventory and the currently
 * selected date, which depends on the inventory.
 * 
 * See https://adamrackis.dev/blog/state-and-use-reducer
 * 
 * @param state     Current state of the control
 * @param action    Action taken (setCurDate, setInventory)
 * @param data      Payload of that action (date, inventory)
 */
const invReducer = (state, [action, data]) => {
    // console.debug("TabbedGallery reduce", state, action, data);
    const { inventory, inventoryName, tz, galleryFunc, date } = data;

    switch (action) {
        case "setCurDate":
            return {
                ...state,
                curDate: date,
                galleryComponent: galleryFunc(date, false)
            }

        case "setInventory":
            const { curDate } = state,
                availTimes = getAvailTimes(inventory, inventoryName, tz),
                newDate = getValidTime(curDate, availTimes, inventoryName);

            return {
                ...state,
                inventory: inventory,
                availTimes: availTimes,
                curDate: newDate,
                galleryComponent: galleryFunc(newDate, availTimes.length === 0)
            }
    }

    return state;
}

export default function TabbedGallery({
    availTabs = [],    // [{ key, icon, label, serviceUuid, inventoryName, galleryComponent (date) => JSX }, inventory?]
    timezone,   // named, ie "America/New_York" - if none, will use browser's timezone. will be problem on server side rendering.
    selectedTab,
    onTabClick,
}) {
    const { apiUrl, apiVersion, token } = useAPIContext();

    const [curTab, setCurTab] = useState(availTabs.length && availTabs[0].key);
    const [state, dispatch] = useReducer(invReducer, {
        curDate: new Date(),
        inventory: [],
        availTimes: [],
        galleryComponent: null,
    });

    // curtab is only used if selected tab/on tab click not set
    const internalTabManaged = (onTabClick === undefined),
        activeTab = internalTabManaged ? curTab : selectedTab,
        curTabData = availTabs && availTabs.find((at) => at.key === activeTab);

    // figure out timezone
    const tz = useMemo(() => {
        if (timezone) {
            return timezone;
        }

        return Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/New_York';
    }, [timezone]);

    useEffect(() => {
        // if inventory set statically, set it and don't do anything else here
        if (curTabData && curTabData.inventory) {
            dispatch([
                'setInventory',
                { inventory: curTabData.inventory, inventoryName: curTabData.inventoryName, tz: tz, galleryFunc: curTabData.galleryComponent },
            ]);
            return;
        }

        let active = true;

        const loadInventory = async () => {
            // retrieve inventory for this service
            const dataInventoryResponse = await fetch(
                `${apiUrl}/${apiVersion}/services/${curTabData.serviceUuid}/inventory/`,
                {
                    headers: {
                        Authorization: `Token ${token}`,
                        Accept: 'application/json',
                    },
                }
            );

            // short circuit if cancelled
            if (!active) {
                return;
            }

            dispatch([
                'setInventory',
                {
                    inventory: (await dataInventoryResponse.json()).results,
                    inventoryName: curTabData.inventoryName,
                    tz: tz,
                    galleryFunc: curTabData.galleryComponent
                },
            ]);
        };

        if (curTabData) {
            loadInventory();
        }

        return () => {
            active = false;
        }; // "cancellable"
    }, [selectedTab, tz]);

    // memoize the time selector component based on the inventory type
    const timeSelectorComponent = useMemo(() => {
        if (!curTabData) { return null; }
        if (!curTabData.inventoryName) { return null; }

        const {curDate, availTimes} = state;

        if (curTabData.inventoryName === 'daily') {
            const initDate = ('start' in curDate) ? curDate.start : curDate,
                key=`${curTabData.inventoryName}-${initDate.toISOString()}`;

            return (
                <DatePicker
                    key={key}
                    initialDate={initDate}
                    availableDays={availTimes}
                    onDateSelected={(d) => {
                        dispatch(['setCurDate', {date: d, galleryFunc: curTabData.galleryComponent}])
                    }}
                    timezone={tz}
                />
            );
        } else if (curTabData.inventoryName === 'monthly') {
            // @TODO: MonthlyPicker doesn't know about ranges yet. give it a singular date
            const passDate =
                    'start' in curDate
                        ? addDays(curDate.start, Math.abs(differenceInDays(curDate.start, curDate.end))) // middle of range, should be middle of month
                        : curDate,
                key = `${curTabData.inventoryName}-${passDate.toISOString()}`;

            return (
                <MonthPicker
                    key={key}
                    initialDate={passDate}
                    availableMonths={availTimes}
                    onDateSelected={(d) => {
                        dispatch([
                            'setCurDate',
                            {
                                date: {
                                    start: startOfMonth(d),
                                    end: endOfMonth(d),
                                },
                                galleryFunc: curTabData.galleryComponent,
                            },
                        ]);
                    }}
                    timezone={tz}
                />
            );
        }
    }, [state, tz])

    // event handlers
    const selectTab = (e, at) => {
        e.preventDefault();

        if (internalTabManaged) {
            setCurTab(at);
            return;
        }

        if (onTabClick) {
            onTabClick(at);
            return;
        }
    };

    return (
        <div>
            <ul
                className='nav nav-tabs flex flex-col md:flex-row flex-wrap list-none border-b-0 pl-0 mb-4'
                id='tabs-tab'
                role='tablist'
            >
                {availTabs.map((at) => {
                    return (
                        <li key={at.key} className='nav-item' role='presentation'>
                            <a
                                href={`#tabs-${at.key}`}
                                className={classNames(
                                    'nav-link block font-medium text-xs leading-tight uppercase border-x-0 border-t-0 border-b-2 border-transparent px-6 py-3 my-2 hover:border-transparent hover:bg-gray-100',
                                    {
                                        'text-primary border-primary hover:border-primary-darker hover:text-primary-darker':
                                            at.key === activeTab,
                                    }
                                )}
                                id={`tabs-${at.key}-tab`}
                                role='tab'
                                aria-controls={`tabs-${at.key}`}
                                aria-selected={at.key === activeTab ? 'true' : 'false'}
                                onClick={(e) => selectTab(e, at.key)}
                            >
                                {at.icon}
                                {at.label || at.key}
                            </a>
                        </li>
                    );
                })}

                <li className='ml-auto my-2'>{timeSelectorComponent}</li>
            </ul>
            <div>
                {state.galleryComponent && (
                    <div
                        key={`tab-${curTabData.key}`}
                        id={`tabs-${curTabData.key}`}
                        role='tabpanel'
                        aria-labelledby={`tabs-${curTabData.key}-tab`}
                    >
                        {state.galleryComponent}
                    </div>
                )}
            </div>
        </div>
    );
}

TabbedGallery.propTypes = {
    availTabs: PropTypes.arrayOf(
        PropTypes.shape({
            key: PropTypes.string.isRequired,
            label: PropTypes.string,
            icon: PropTypes.object,
            serviceUuid: PropTypes.string,
            galleryComponent: PropTypes.func,
            inventoryName: PropTypes.string,
            inventory: PropTypes.arrayOf(
                PropTypes.shape({
                    type: PropTypes.string.isRequired,
                    meta: PropTypes.shape({
                        fields: PropTypes.arrayOf(
                            PropTypes.shape({
                                name: PropTypes.string.isRequired,
                                type: PropTypes.string.isRequired,
                                label: PropTypes.string.isRequired,
                            })
                        ),
                    }),
                    name: PropTypes.string.isRequired,
                    values: PropTypes.arrayOf(PropTypes.array),
                })
            ),
        })
    ),
    timezone: PropTypes.string,
    selectedTab: PropTypes.string,
    onTabClick: PropTypes.func,
};
