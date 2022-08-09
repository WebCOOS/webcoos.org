import React, { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import { DatePicker } from '@axds/landing-page-components';
import { parseISO, startOfMonth, endOfMonth, clamp, differenceInDays } from 'date-fns';

export default function TabbedGallery({
    apiUrl,
    apiVersion = 'v1',
    token = process.env.NEXT_PUBLIC_WEBCOOS_API_TOKEN || process.env.STORYBOOK_WEBCOOS_API_TOKEN,
    selectedTab,
    availTabs = [],    // [{ key, icon, label, serviceUuid, galleryComponent (date) => JSX }, inventory?]
}) {
    const [curTab, setCurTab] = useState(selectedTab || availTabs.length && availTabs[0].key);
    const [curDate, setCurDate] = useState(new Date());
    const [curInventory, setCurInventory] = useState([]);

    const curTabData = useMemo(() => {
        const tabData = availTabs.find((at) => at.key === curTab);
        return tabData;
    }, [availTabs, curTab])

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
            if (!active) { return; }
            setCurInventory((await dataInventoryResponse.json()).results);
        }

        loadInventory();

        return () => { active = false; }    // "cancellable"
    }, [curTabData])

    const dateExtents = useMemo(() => {
        const daily = curInventory.find((i) => i.name === 'daily');
        if (daily) {
            const firstDate = parseISO(daily.values[0][0]);
            const lastDate = parseISO(daily.values[daily.values.length - 1][0]);
            return { start: firstDate, end: lastDate }
        }
    }, [curInventory]);

    // when tab changes, inventory likely changes too.  make sure the new date is
    // one that has data.
    useEffect(() => {
        const daily = curInventory.find(i => i.name === 'daily');
        if (daily) {
            // filter it into ones that have data then then take distance from the current date
            const withData = daily.values
                .filter(v => v[1] === 1)
                .map(v => {
                    const vDate = parseISO(v[0]);
                    return [
                        vDate,
                        Math.abs(differenceInDays(vDate, curDate))
                    ]
                });

            withData.sort((a, b) => (a[1] - b[1]));
            setCurDate(withData[0][0]);
        }
    }, [curInventory]);

    // event handlers
    const selectTab = (e, at) => {
        setCurTab(at);
        e.preventDefault();
    };

    const onDateSelected = (date) => {
      setCurDate(date);
    }

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
                                href='#tabs-home'
                                className={classNames(
                                    'nav-link block font-medium text-xs leading-tight uppercase border-x-0 border-t-0 border-b-2 border-transparent px-6 py-3 my-2 hover:border-transparent hover:bg-gray-100',
                                    {
                                        'text-primary border-primary hover:border-primary-darker hover:text-primary-darker':
                                            at.key === curTab,
                                    }
                                )}
                                id={`tabs-${at.key}-tab`}
                                role='tab'
                                aria-controls={`tabs-${at.key}`}
                                aria-selected={at.key === curTab ? 'true' : 'false'}
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
                        key={`${curDate.toISOString()}-${curTab}`}
                        initialDate={curDate}
                        minDate={dateExtents && dateExtents.start && startOfMonth(dateExtents.start)}
                        maxDate={dateExtents && dateExtents.end && endOfMonth(dateExtents.end)}
                        inventory={curInventory}
                        onDateSelected={onDateSelected}
                    />
                </li>
            </ul>
            <div>
                {availTabs.map((at, atIdx) => {
                    return (
                        <div
                            key={`tab-${at.key}`}
                            className={classNames('fade', {
                                visible: curTab === at.key,
                                hidden: curTab !== at.key,
                            })}
                            id={`tabs-${at.key}`}
                            role='tabpanel'
                            aria-labelledby={`tabs-${at.key}-tab`}
                        >
                            {at.galleryComponent(curDate)}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

TabbedGallery.propTypes = {
    apiUrl: PropTypes.string,
    apiVersion: PropTypes.string,
    token: PropTypes.string,
    selectedTab: PropTypes.string,
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
};