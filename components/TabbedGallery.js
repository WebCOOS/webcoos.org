import React, { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { DatePicker } from '@axds/landing-page-components';
import { parseISO, startOfDay, differenceInDays, addMinutes } from 'date-fns';
import { utcToZonedTime, zonedTimeToUtc, format, } from 'date-fns-tz';
import { useAPIContext } from './contexts/ApiContext';


// extract dates from inventory
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


export default function TabbedGallery({
    availTabs = [],    // [{ key, icon, label, serviceUuid, galleryComponent (date) => JSX }, inventory?]
    timezone,   // named, ie "America/New_York" - if none, will use browser's timezone. will be problem on server side rendering.
    selectedTab,
    onTabClick,
}) {
    const { apiUrl, apiVersion, token } = useAPIContext();

    const [curTab, setCurTab] = useState(availTabs.length && availTabs[0].key);
    const [curDate, setCurDate] = useState(new Date());
    const [curInventory, setCurInventory] = useState([]);

    // curtab is only used if selected tab/on tab click not set
    const internalTabManaged = (onTabClick === undefined),
        activeTab = internalTabManaged ? curTab : selectedTab,
        curTabData = availTabs && availTabs.find((at) => at.key === activeTab);

    useEffect(() => {
        // if inventory set statically, set it and don't do anything else here
        if (curTabData && curTabData.inventory) {
            setCurInventory(curTabData.inventory);
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
            setCurInventory((await dataInventoryResponse.json()).results);
        };

        if (curTabData) {
            loadInventory();
        }

        return () => {
            active = false;
        }; // "cancellable"
    }, [curTabData]);

    // figure out timezone
    const tz = useMemo(() => {
        if (timezone) {
            return timezone;
        }

        return Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/New_York';
    }, [timezone]);

    // parse inventory into available days, in local timezone
    const availDays = useMemo(() => {
        const daily = (curInventory || []).find((i) => i.name === 'daily');
        if (!daily) {
            return [];      // empty array means no available days
        }
        return getDates(daily, tz);
    }, [curInventory, tz]);

    // when tab changes, inventory likely changes too.  make sure the new date is
    // one that has data.
    useEffect(() => {
        const daily = curInventory.find((i) => i.name === 'daily');
        if (daily) {
            const allDates = getDates(daily, tz),
                withData = allDates.map((v) => {
                    return [v, Math.abs(differenceInDays(v, curDate))];
                });

            withData.sort((a, b) => a[1] - b[1]);
            setCurDate(withData[0][0]);
        }
    }, [curInventory, tz]);

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

    const onDateSelected = (date) => {
        setCurDate(date);
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

                <li className='ml-auto my-2'>
                    <DatePicker
                        key={`${curDate.toISOString()}-${activeTab}`}
                        initialDate={curDate}
                        availableDays={availDays}
                        onDateSelected={onDateSelected}
                        timezone={timezone}
                    />
                </li>
            </ul>
            <div>
                {availTabs.map((at, atIdx) => {
                    return (
                        <div
                            key={`tab-${at.key}`}
                            className={classNames('fade', {
                                visible: activeTab === at.key,
                                hidden: activeTab !== at.key,
                            })}
                            id={`tabs-${at.key}`}
                            role='tabpanel'
                            aria-labelledby={`tabs-${at.key}-tab`}
                        >
                            {at.galleryComponent(curDate, availDays && availDays.length === 0)}
                        </div>
                    );
                })}
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
