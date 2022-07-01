import React, { useEffect, useMemo, useState, useRef } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import { DatePicker } from '@axds/landing-page-components';

export default function TabbedGallery({
  selectedTab,
  availTabs = [],    // [{ key, icon, label, galleryComponent (date) => JSX }]
}) {
    const [curTab, setCurTab] = useState(selectedTab);
    const [curDate, setCurDate] = useState(new Date());

    // set default tab on initial load if none set
    useEffect(() => {
      if (!selectedTab && availTabs.length) {
        setCurTab(availTabs[0].key)
      }
    }, []);

    // // gallery components have to be redone when the date changes
    // const galleries = useMemo(() => {
    //   return availTabs.map(at => {
    //     return at.galleryComponent(curDate);
    //   })

    // }, [availTabs, curDate]);

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
                                {at.key}
                            </a>
                        </li>
                    );
                })}

                <li className='ml-auto my-2'>
                  <DatePicker 
                    initialDate={curDate}
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