import React from 'react';

import TabbedGallery from './TabbedGallery';
import MediaGallery from './MediaGallery';
import { IconCamera, IconVideoCamera } from './Icon';

export default {
    component: TabbedGallery,
    title: 'TabbedGallery',
};

const Template = (args) => (
    <div className='max-w-4xl'>
        <TabbedGallery {...args} />
    </div>
);

export const Default = Template.bind({});
Default.args = {
    apiUrl: 'https://app.stage.webcoos.org/webcoos/api',
    availTabs: [
        {
            key: 'stills',
            label: 'Imagery',
            icon: <IconCamera size={4} extraClasses='inline-block pr-1 align-bottom' paddingx={0} />,
            serviceUuid: 'b7114ae2-b2cb-40fe-af33-820db2db7755',
            galleryComponent: (date) => {
                return (
                    <MediaGallery
                        key={`${date.toISOString()}-b7114ae2-b2cb-40fe-af33-820db2db7755`}
                        apiUrl='https://app.stage.webcoos.org/webcoos/api'
                        serviceUuid='b7114ae2-b2cb-40fe-af33-820db2db7755' // currituck hampton inn one minute stills
                        selectedDate={date}
                        iconComponent={
                            <IconCamera size={4} extraClasses='inline-block pr-1 align-bottom' paddingx={0} />
                        }
                        zoomedComponent={(zoomed, onClick) => (
                            <img
                                className='object-contain'
                                src={zoomed.data.properties.url}
                                alt={zoomed.data.dateTimeStr}
                                onClick={onClick}
                            />
                        )}
                    />
                );
            }
        },
        {
            key: 'videos',
            icon: <IconVideoCamera size={4} extraClasses='inline-block pr-1 align-bottom' paddingx={0} />,
            serviceUuid: '1d130de0-f99b-436d-b96a-c3929904b335', // currituck sailfish video archive
            galleryComponent: (date) => {
                return (
                    <MediaGallery
                        key={`${date.toISOString()}-1d130de0-f99b-436d-b96a-c3929904b3355`}
                        apiUrl='https://app.stage.webcoos.org/webcoos/api'
                        serviceUuid='1d130de0-f99b-436d-b96a-c3929904b335' // currituck sailfish video archive
                        selectedDate={date}
                        iconComponent={
                            <IconVideoCamera size={4} extraClasses='inline-block pr-1 align-bottom' paddingx={0} />
                        }
                        zoomedComponent={(zoomed, onClick) => (
                            <video className='object-contain' controls onClick={onClick}>
                                <source src={zoomed.data.properties.url} type='video/mp4' />
                            </video>
                        )}
                    />
                );
            },
        },
    ],
};

export const StaticInventory = Template.bind({});
StaticInventory.args = {
    availTabs: [
        {
            key: 'stills',
            label: 'Imagery',
            icon: <IconCamera size={4} extraClasses='inline-block pr-1 align-bottom' paddingx={0} />,
            serviceUuid: 'b7114ae2-b2cb-40fe-af33-820db2db7755',
            galleryComponent: (date) => {
                return (
                    <MediaGallery
                        key={`${date.toISOString()}-b7114ae2-b2cb-40fe-af33-820db2db7755`}
                        apiUrl='https://app.stage.webcoos.org/webcoos/api'
                        serviceUuid='b7114ae2-b2cb-40fe-af33-820db2db7755' // currituck hampton inn one minute stills
                        selectedDate={date}
                        iconComponent={
                            <IconCamera size={4} extraClasses='inline-block pr-1 align-bottom' paddingx={0} />
                        }
                        zoomedComponent={(zoomed, onClick) => (
                            <img
                                className='object-contain'
                                src={zoomed.data.properties.url}
                                alt={zoomed.data.dateTimeStr}
                                onClick={onClick}
                            />
                        )}
                    />
                );
            },
            inventory: [
                {
                    type: 'inventory',
                    meta: {
                        fields: [
                            {
                                name: 'starting',
                                type: 'datetime',
                                label: 'Start',
                            },
                            {
                                name: 'has_data',
                                type: 'bool',
                                label: 'Has Data?',
                            },
                            {
                                name: 'ending',
                                type: 'datetime',
                                label: 'End',
                            },
                            {
                                name: 'count',
                                type: 'int',
                                label: 'Count',
                            },
                            {
                                name: 'size',
                                type: 'int',
                                label: 'Bytes',
                            },
                        ],
                    },
                    name: 'daily',
                    values: [
                        ['2022-04-03 00:00:00+00:00', 1, '2022-04-04 00:00:00+00:00', 332, 120902227],
                        ['2022-04-04 00:00:00+00:00', 0, '2022-04-05 00:00:00+00:00', 0, 0],
                        ['2022-04-05 00:00:00+00:00', 0, '2022-04-06 00:00:00+00:00', 0, 0],
                        ['2022-04-06 00:00:00+00:00', 0, '2022-04-07 00:00:00+00:00', 0, 0],
                        ['2022-04-07 00:00:00+00:00', 0, '2022-04-08 00:00:00+00:00', 0, 0],
                        ['2022-04-08 00:00:00+00:00', 0, '2022-04-09 00:00:00+00:00', 0, 0],
                        ['2022-04-09 00:00:00+00:00', 0, '2022-04-10 00:00:00+00:00', 0, 0],
                        ['2022-04-10 00:00:00+00:00', 0, '2022-04-11 00:00:00+00:00', 0, 0],
                        ['2022-04-11 00:00:00+00:00', 0, '2022-04-12 00:00:00+00:00', 0, 0],
                        ['2022-04-12 00:00:00+00:00', 0, '2022-04-13 00:00:00+00:00', 0, 0],
                        ['2022-04-13 00:00:00+00:00', 0, '2022-04-14 00:00:00+00:00', 0, 0],
                        ['2022-04-14 00:00:00+00:00', 0, '2022-04-15 00:00:00+00:00', 0, 0],
                        ['2022-04-15 00:00:00+00:00', 0, '2022-04-16 00:00:00+00:00', 0, 0],
                        ['2022-04-16 00:00:00+00:00', 0, '2022-04-17 00:00:00+00:00', 0, 0],
                        ['2022-04-17 00:00:00+00:00', 0, '2022-04-18 00:00:00+00:00', 0, 0],
                        ['2022-04-18 00:00:00+00:00', 0, '2022-04-19 00:00:00+00:00', 0, 0],
                        ['2022-04-19 00:00:00+00:00', 0, '2022-04-20 00:00:00+00:00', 0, 0],
                        ['2022-04-20 00:00:00+00:00', 0, '2022-04-21 00:00:00+00:00', 0, 0],
                        ['2022-04-21 00:00:00+00:00', 0, '2022-04-22 00:00:00+00:00', 0, 0],
                        ['2022-04-22 00:00:00+00:00', 0, '2022-04-23 00:00:00+00:00', 0, 0],
                        ['2022-04-23 00:00:00+00:00', 0, '2022-04-24 00:00:00+00:00', 0, 0],
                        ['2022-04-24 00:00:00+00:00', 0, '2022-04-25 00:00:00+00:00', 0, 0],
                        ['2022-04-25 00:00:00+00:00', 0, '2022-04-26 00:00:00+00:00', 0, 0],
                        ['2022-04-26 00:00:00+00:00', 0, '2022-04-27 00:00:00+00:00', 0, 0],
                        ['2022-04-27 00:00:00+00:00', 0, '2022-04-28 00:00:00+00:00', 0, 0],
                        ['2022-04-28 00:00:00+00:00', 0, '2022-04-29 00:00:00+00:00', 0, 0],
                        ['2022-04-29 00:00:00+00:00', 0, '2022-04-30 00:00:00+00:00', 0, 0],
                        ['2022-04-30 00:00:00+00:00', 0, '2022-05-01 00:00:00+00:00', 0, 0],
                        ['2022-05-01 00:00:00+00:00', 0, '2022-05-02 00:00:00+00:00', 0, 0],
                        ['2022-05-02 00:00:00+00:00', 0, '2022-05-03 00:00:00+00:00', 0, 0],
                        ['2022-05-03 00:00:00+00:00', 0, '2022-05-04 00:00:00+00:00', 0, 0],
                        ['2022-05-04 00:00:00+00:00', 0, '2022-05-05 00:00:00+00:00', 0, 0],
                        ['2022-05-05 00:00:00+00:00', 0, '2022-05-06 00:00:00+00:00', 0, 0],
                        ['2022-05-06 00:00:00+00:00', 0, '2022-05-07 00:00:00+00:00', 0, 0],
                        ['2022-05-07 00:00:00+00:00', 0, '2022-05-08 00:00:00+00:00', 0, 0],
                        ['2022-05-08 00:00:00+00:00', 1, '2022-05-09 00:00:00+00:00', 1308, 417307781],
                    ],
                },
                {
                    type: 'inventory',
                    meta: {
                        fields: [
                            {
                                name: 'starting',
                                type: 'datetime',
                                label: 'Start',
                            },
                            {
                                name: 'has_data',
                                type: 'bool',
                                label: 'Has Data?',
                            },
                            {
                                name: 'ending',
                                type: 'datetime',
                                label: 'End',
                            },
                            {
                                name: 'count',
                                type: 'int',
                                label: 'Count',
                            },
                            {
                                name: 'size',
                                type: 'int',
                                label: 'Bytes',
                            },
                        ],
                    },
                    name: 'weekly',
                    values: [
                        ['2022-03-27 00:00:00+00:00', 1, '2022-04-03 00:00:00+00:00', 332, 120902227],
                        ['2022-04-03 00:00:00+00:00', 0, '2022-04-10 00:00:00+00:00', 0, 0],
                        ['2022-04-10 00:00:00+00:00', 0, '2022-04-17 00:00:00+00:00', 0, 0],
                        ['2022-04-17 00:00:00+00:00', 0, '2022-04-24 00:00:00+00:00', 0, 0],
                        ['2022-04-24 00:00:00+00:00', 0, '2022-05-01 00:00:00+00:00', 0, 0],
                        ['2022-05-01 00:00:00+00:00', 1, '2022-05-08 00:00:00+00:00', 1308, 417307781],
                    ],
                },
                {
                    type: 'inventory',
                    meta: {
                        fields: [
                            {
                                name: 'starting',
                                type: 'datetime',
                                label: 'Start',
                            },
                            {
                                name: 'has_data',
                                type: 'bool',
                                label: 'Has Data?',
                            },
                            {
                                name: 'ending',
                                type: 'datetime',
                                label: 'End',
                            },
                            {
                                name: 'count',
                                type: 'int',
                                label: 'Count',
                            },
                            {
                                name: 'size',
                                type: 'int',
                                label: 'Bytes',
                            },
                        ],
                    },
                    name: 'monthly',
                    values: [
                        ['2022-04-01 00:00:00+00:00', 1, '2022-04-30 00:00:00+00:00', 332, 120902227],
                        ['2022-05-01 00:00:00+00:00', 1, '2022-05-31 00:00:00+00:00', 1308, 417307781],
                    ],
                },
            ]
        },
        {
            key: 'videos',
            icon: <IconVideoCamera size={4} extraClasses='inline-block pr-1 align-bottom' paddingx={0} />,
            serviceUuid: '1d130de0-f99b-436d-b96a-c3929904b335', // currituck sailfish video archive
            galleryComponent: (date) => {
                return (
                    <MediaGallery
                        key={`${date.toISOString()}-1d130de0-f99b-436d-b96a-c3929904b3355`}
                        apiUrl='https://app.stage.webcoos.org/webcoos/api'
                        serviceUuid='1d130de0-f99b-436d-b96a-c3929904b335' // currituck sailfish video archive
                        selectedDate={date}
                        iconComponent={
                            <IconVideoCamera size={4} extraClasses='inline-block pr-1 align-bottom' paddingx={0} />
                        }
                        zoomedComponent={(zoomed, onClick) => (
                            <video className='object-contain' controls onClick={onClick}>
                                <source src={zoomed.data.properties.url} type='video/mp4' />
                            </video>
                        )}
                    />
                );
            },
            inventory: [
                {
                    type: 'inventory',
                    meta: {
                        fields: [
                            {
                                name: 'starting',
                                type: 'datetime',
                                label: 'Start',
                            },
                            {
                                name: 'has_data',
                                type: 'bool',
                                label: 'Has Data?',
                            },
                            {
                                name: 'ending',
                                type: 'datetime',
                                label: 'End',
                            },
                            {
                                name: 'count',
                                type: 'int',
                                label: 'Count',
                            },
                            {
                                name: 'size',
                                type: 'int',
                                label: 'Bytes',
                            },
                        ],
                    },
                    name: 'daily',
                    values: [
                        ['2022-02-03 00:00:00+00:00', 1, '2022-02-04 00:00:00+00:00', 11, 622413145],
                        ['2022-02-04 00:00:00+00:00', 0, '2022-02-05 00:00:00+00:00', 0, 0],
                        ['2022-02-05 00:00:00+00:00', 0, '2022-02-06 00:00:00+00:00', 0, 0],
                        ['2022-02-06 00:00:00+00:00', 0, '2022-02-07 00:00:00+00:00', 0, 0],
                        ['2022-02-07 00:00:00+00:00', 0, '2022-02-08 00:00:00+00:00', 0, 0],
                        ['2022-02-08 00:00:00+00:00', 0, '2022-02-09 00:00:00+00:00', 0, 0],
                        ['2022-02-09 00:00:00+00:00', 0, '2022-02-10 00:00:00+00:00', 0, 0],
                        ['2022-02-10 00:00:00+00:00', 0, '2022-02-11 00:00:00+00:00', 0, 0],
                        ['2022-02-11 00:00:00+00:00', 0, '2022-02-12 00:00:00+00:00', 0, 0],
                        ['2022-02-12 00:00:00+00:00', 0, '2022-02-13 00:00:00+00:00', 0, 0],
                        ['2022-02-13 00:00:00+00:00', 0, '2022-02-14 00:00:00+00:00', 0, 0],
                        ['2022-02-14 00:00:00+00:00', 0, '2022-02-15 00:00:00+00:00', 0, 0],
                        ['2022-02-15 00:00:00+00:00', 0, '2022-02-16 00:00:00+00:00', 0, 0],
                        ['2022-02-16 00:00:00+00:00', 0, '2022-02-17 00:00:00+00:00', 0, 0],
                        ['2022-02-17 00:00:00+00:00', 0, '2022-02-18 00:00:00+00:00', 0, 0],
                        ['2022-02-18 00:00:00+00:00', 0, '2022-02-19 00:00:00+00:00', 0, 0],
                        ['2022-02-19 00:00:00+00:00', 0, '2022-02-20 00:00:00+00:00', 0, 0],
                        ['2022-02-20 00:00:00+00:00', 0, '2022-02-21 00:00:00+00:00', 0, 0],
                        ['2022-02-21 00:00:00+00:00', 0, '2022-02-22 00:00:00+00:00', 0, 0],
                        ['2022-02-22 00:00:00+00:00', 0, '2022-02-23 00:00:00+00:00', 0, 0],
                        ['2022-02-23 00:00:00+00:00', 0, '2022-02-24 00:00:00+00:00', 0, 0],
                        ['2022-02-24 00:00:00+00:00', 0, '2022-02-25 00:00:00+00:00', 0, 0],
                        ['2022-02-25 00:00:00+00:00', 0, '2022-02-26 00:00:00+00:00', 0, 0],
                        ['2022-02-26 00:00:00+00:00', 0, '2022-02-27 00:00:00+00:00', 0, 0],
                        ['2022-02-27 00:00:00+00:00', 0, '2022-02-28 00:00:00+00:00', 0, 0],
                        ['2022-02-28 00:00:00+00:00', 0, '2022-03-01 00:00:00+00:00', 0, 0],
                        ['2022-03-01 00:00:00+00:00', 0, '2022-03-02 00:00:00+00:00', 0, 0],
                        ['2022-03-02 00:00:00+00:00', 0, '2022-03-03 00:00:00+00:00', 0, 0],
                        ['2022-03-03 00:00:00+00:00', 0, '2022-03-04 00:00:00+00:00', 0, 0],
                        ['2022-03-04 00:00:00+00:00', 0, '2022-03-05 00:00:00+00:00', 0, 0],
                        ['2022-03-05 00:00:00+00:00', 0, '2022-03-06 00:00:00+00:00', 0, 0],
                        ['2022-03-06 00:00:00+00:00', 0, '2022-03-07 00:00:00+00:00', 0, 0],
                        ['2022-03-07 00:00:00+00:00', 0, '2022-03-08 00:00:00+00:00', 0, 0],
                        ['2022-03-08 00:00:00+00:00', 0, '2022-03-09 00:00:00+00:00', 0, 0],
                        ['2022-03-09 00:00:00+00:00', 0, '2022-03-10 00:00:00+00:00', 0, 0],
                        ['2022-03-10 00:00:00+00:00', 0, '2022-03-11 00:00:00+00:00', 0, 0],
                        ['2022-03-11 00:00:00+00:00', 0, '2022-03-12 00:00:00+00:00', 0, 0],
                        ['2022-03-12 00:00:00+00:00', 0, '2022-03-13 00:00:00+00:00', 0, 0],
                        ['2022-03-13 00:00:00+00:00', 0, '2022-03-14 00:00:00+00:00', 0, 0],
                        ['2022-03-14 00:00:00+00:00', 0, '2022-03-15 00:00:00+00:00', 0, 0],
                        ['2022-03-15 00:00:00+00:00', 0, '2022-03-16 00:00:00+00:00', 0, 0],
                        ['2022-03-16 00:00:00+00:00', 0, '2022-03-17 00:00:00+00:00', 0, 0],
                        ['2022-03-17 00:00:00+00:00', 0, '2022-03-18 00:00:00+00:00', 0, 0],
                        ['2022-03-18 00:00:00+00:00', 0, '2022-03-19 00:00:00+00:00', 0, 0],
                        ['2022-03-19 00:00:00+00:00', 0, '2022-03-20 00:00:00+00:00', 0, 0],
                        ['2022-03-20 00:00:00+00:00', 0, '2022-03-21 00:00:00+00:00', 0, 0],
                        ['2022-03-21 00:00:00+00:00', 0, '2022-03-22 00:00:00+00:00', 0, 0],
                        ['2022-03-22 00:00:00+00:00', 0, '2022-03-23 00:00:00+00:00', 0, 0],
                        ['2022-03-23 00:00:00+00:00', 0, '2022-03-24 00:00:00+00:00', 0, 0],
                        ['2022-03-24 00:00:00+00:00', 0, '2022-03-25 00:00:00+00:00', 0, 0],
                        ['2022-03-25 00:00:00+00:00', 0, '2022-03-26 00:00:00+00:00', 0, 0],
                        ['2022-03-26 00:00:00+00:00', 0, '2022-03-27 00:00:00+00:00', 0, 0],
                        ['2022-03-27 00:00:00+00:00', 0, '2022-03-28 00:00:00+00:00', 0, 0],
                        ['2022-03-28 00:00:00+00:00', 0, '2022-03-29 00:00:00+00:00', 0, 0],
                        ['2022-03-29 00:00:00+00:00', 0, '2022-03-30 00:00:00+00:00', 0, 0],
                        ['2022-03-30 00:00:00+00:00', 0, '2022-03-31 00:00:00+00:00', 0, 0],
                        ['2022-03-31 00:00:00+00:00', 0, '2022-04-01 00:00:00+00:00', 0, 0],
                        ['2022-04-01 00:00:00+00:00', 0, '2022-04-02 00:00:00+00:00', 0, 0],
                        ['2022-04-02 00:00:00+00:00', 0, '2022-04-03 00:00:00+00:00', 0, 0],
                        ['2022-04-03 00:00:00+00:00', 0, '2022-04-04 00:00:00+00:00', 0, 0],
                        ['2022-04-04 00:00:00+00:00', 0, '2022-04-05 00:00:00+00:00', 0, 0],
                        ['2022-04-05 00:00:00+00:00', 0, '2022-04-06 00:00:00+00:00', 0, 0],
                        ['2022-04-06 00:00:00+00:00', 0, '2022-04-07 00:00:00+00:00', 0, 0],
                        ['2022-04-07 00:00:00+00:00', 0, '2022-04-08 00:00:00+00:00', 0, 0],
                        ['2022-04-08 00:00:00+00:00', 0, '2022-04-09 00:00:00+00:00', 0, 0],
                        ['2022-04-09 00:00:00+00:00', 0, '2022-04-10 00:00:00+00:00', 0, 0],
                        ['2022-04-10 00:00:00+00:00', 0, '2022-04-11 00:00:00+00:00', 0, 0],
                        ['2022-04-11 00:00:00+00:00', 0, '2022-04-12 00:00:00+00:00', 0, 0],
                        ['2022-04-12 00:00:00+00:00', 0, '2022-04-13 00:00:00+00:00', 0, 0],
                        ['2022-04-13 00:00:00+00:00', 0, '2022-04-14 00:00:00+00:00', 0, 0],
                        ['2022-04-14 00:00:00+00:00', 0, '2022-04-15 00:00:00+00:00', 0, 0],
                        ['2022-04-15 00:00:00+00:00', 0, '2022-04-16 00:00:00+00:00', 0, 0],
                        ['2022-04-16 00:00:00+00:00', 0, '2022-04-17 00:00:00+00:00', 0, 0],
                        ['2022-04-17 00:00:00+00:00', 0, '2022-04-18 00:00:00+00:00', 0, 0],
                        ['2022-04-18 00:00:00+00:00', 0, '2022-04-19 00:00:00+00:00', 0, 0],
                        ['2022-04-19 00:00:00+00:00', 0, '2022-04-20 00:00:00+00:00', 0, 0],
                        ['2022-04-20 00:00:00+00:00', 0, '2022-04-21 00:00:00+00:00', 0, 0],
                        ['2022-04-21 00:00:00+00:00', 0, '2022-04-22 00:00:00+00:00', 0, 0],
                        ['2022-04-22 00:00:00+00:00', 0, '2022-04-23 00:00:00+00:00', 0, 0],
                        ['2022-04-23 00:00:00+00:00', 0, '2022-04-24 00:00:00+00:00', 0, 0],
                        ['2022-04-24 00:00:00+00:00', 0, '2022-04-25 00:00:00+00:00', 0, 0],
                        ['2022-04-25 00:00:00+00:00', 0, '2022-04-26 00:00:00+00:00', 0, 0],
                        ['2022-04-26 00:00:00+00:00', 0, '2022-04-27 00:00:00+00:00', 0, 0],
                        ['2022-04-27 00:00:00+00:00', 0, '2022-04-28 00:00:00+00:00', 0, 0],
                        ['2022-04-28 00:00:00+00:00', 0, '2022-04-29 00:00:00+00:00', 0, 0],
                        ['2022-04-29 00:00:00+00:00', 0, '2022-04-30 00:00:00+00:00', 0, 0],
                        ['2022-04-30 00:00:00+00:00', 0, '2022-05-01 00:00:00+00:00', 0, 0],
                        ['2022-05-01 00:00:00+00:00', 0, '2022-05-02 00:00:00+00:00', 0, 0],
                        ['2022-05-02 00:00:00+00:00', 0, '2022-05-03 00:00:00+00:00', 0, 0],
                        ['2022-05-03 00:00:00+00:00', 1, '2022-05-04 00:00:00+00:00', 3, 259552130],
                    ],
                },
                {
                    type: 'inventory',
                    meta: {
                        fields: [
                            {
                                name: 'starting',
                                type: 'datetime',
                                label: 'Start',
                            },
                            {
                                name: 'has_data',
                                type: 'bool',
                                label: 'Has Data?',
                            },
                            {
                                name: 'ending',
                                type: 'datetime',
                                label: 'End',
                            },
                            {
                                name: 'count',
                                type: 'int',
                                label: 'Count',
                            },
                            {
                                name: 'size',
                                type: 'int',
                                label: 'Bytes',
                            },
                        ],
                    },
                    name: 'weekly',
                    values: [
                        ['2022-01-30 00:00:00+00:00', 1, '2022-02-06 00:00:00+00:00', 11, 622413145],
                        ['2022-02-06 00:00:00+00:00', 0, '2022-02-13 00:00:00+00:00', 0, 0],
                        ['2022-02-13 00:00:00+00:00', 0, '2022-02-20 00:00:00+00:00', 0, 0],
                        ['2022-02-20 00:00:00+00:00', 0, '2022-02-27 00:00:00+00:00', 0, 0],
                        ['2022-02-27 00:00:00+00:00', 0, '2022-03-06 00:00:00+00:00', 0, 0],
                        ['2022-03-06 00:00:00+00:00', 0, '2022-03-13 00:00:00+00:00', 0, 0],
                        ['2022-03-13 00:00:00+00:00', 0, '2022-03-20 00:00:00+00:00', 0, 0],
                        ['2022-03-20 00:00:00+00:00', 0, '2022-03-27 00:00:00+00:00', 0, 0],
                        ['2022-03-27 00:00:00+00:00', 0, '2022-04-03 00:00:00+00:00', 0, 0],
                        ['2022-04-03 00:00:00+00:00', 0, '2022-04-10 00:00:00+00:00', 0, 0],
                        ['2022-04-10 00:00:00+00:00', 0, '2022-04-17 00:00:00+00:00', 0, 0],
                        ['2022-04-17 00:00:00+00:00', 0, '2022-04-24 00:00:00+00:00', 0, 0],
                        ['2022-04-24 00:00:00+00:00', 0, '2022-05-01 00:00:00+00:00', 0, 0],
                        ['2022-05-01 00:00:00+00:00', 1, '2022-05-08 00:00:00+00:00', 3, 259552130],
                    ],
                },
                {
                    type: 'inventory',
                    meta: {
                        fields: [
                            {
                                name: 'starting',
                                type: 'datetime',
                                label: 'Start',
                            },
                            {
                                name: 'has_data',
                                type: 'bool',
                                label: 'Has Data?',
                            },
                            {
                                name: 'ending',
                                type: 'datetime',
                                label: 'End',
                            },
                            {
                                name: 'count',
                                type: 'int',
                                label: 'Count',
                            },
                            {
                                name: 'size',
                                type: 'int',
                                label: 'Bytes',
                            },
                        ],
                    },
                    name: 'monthly',
                    values: [
                        ['2022-02-01 00:00:00+00:00', 1, '2022-02-28 00:00:00+00:00', 11, 622413145],
                        ['2022-03-01 00:00:00+00:00', 0, '2022-03-31 00:00:00+00:00', 0, 0],
                        ['2022-04-01 00:00:00+00:00', 0, '2022-04-30 00:00:00+00:00', 0, 0],
                        ['2022-05-01 00:00:00+00:00', 1, '2022-05-31 00:00:00+00:00', 3, 259552130],
                    ],
                },
            ],
        },
    ],
};

export const NorthInletDayBoundary = Template.bind({});
NorthInletDayBoundary.args = {
    availTabs: [
        {
            key: 'northinlet-one-minute-stills-s3',
            label: 'northinlet-one-minute-stills-s3',
            serviceUuid: '70714572-3436-45ef-b4f9-1df59e5c293f',
            icon: <IconCamera size={4} extraClasses='inline-block pr-1 align-bottom' paddingx={0} />,
            galleryComponent: (date) => {
                return (
                    <MediaGallery
                        key={`${date.toISOString()}`}
                        apiUrl='https://app.stage.webcoos.org/webcoos/api'
                        serviceUuid='70714572-3436-45ef-b4f9-1df59e5c293f'
                        selectedDate={date}
                        iconComponent={
                            <IconCamera size={4} extraClasses='inline-block pr-1 align-bottom' paddingx={0} />
                        }
                        zoomedComponent={(zoomed, onClick) => (
                            <img
                                className='object-contain'
                                src={zoomed.data.properties.url}
                                alt={zoomed.data.dateTimeStr}
                                onClick={onClick}
                            />
                        )}
                    />
                );
            },
            inventory: [
                {
                    type: 'inventory',
                    meta: {
                        fields: [
                            { name: 'starting', type: 'datetime', label: 'Bin Start' },
                            { name: 'has_data', type: 'bool', label: 'Has Data?' },
                            { name: 'ending', type: 'datetime', label: 'Bin End' },
                            { name: 'count', type: 'int', label: 'Count' },
                            { name: 'size', type: 'int', label: 'Bytes' },
                            { name: 'data_starting', type: 'datetime', label: 'Data Start' },
                            { name: 'data_ending', type: 'datetime', label: 'Data End' },
                        ],
                    },
                    name: 'daily',
                    values: [
                        [
                            '2022-06-02 00:00:00+00:00',
                            1,
                            '2022-06-03 00:00:00+00:00',
                            3,
                            1453882,
                            '2022-06-02 18:37:59+00:00',
                            '2022-06-02 18:39:59+00:00',
                        ],
                        [
                            '2022-06-03 00:00:00+00:00',
                            1,
                            '2022-06-04 00:00:00+00:00',
                            4,
                            1061838,
                            '2022-06-03 14:50:30+00:00',
                            '2022-06-03 16:28:32+00:00',
                        ],
                    ],
                },
                {
                    type: 'inventory',
                    meta: {
                        fields: [
                            { name: 'starting', type: 'datetime', label: 'Bin Start' },
                            { name: 'has_data', type: 'bool', label: 'Has Data?' },
                            { name: 'ending', type: 'datetime', label: 'Bin End' },
                            { name: 'count', type: 'int', label: 'Count' },
                            { name: 'size', type: 'int', label: 'Bytes' },
                            { name: 'data_starting', type: 'datetime', label: 'Data Start' },
                            { name: 'data_ending', type: 'datetime', label: 'Data End' },
                        ],
                    },
                    name: 'weekly',
                    values: [
                        [
                            '2022-05-29 00:00:00+00:00',
                            1,
                            '2022-06-05 00:00:00+00:00',
                            7,
                            2515720,
                            '2022-06-02 18:37:59+00:00',
                            '2022-06-03 16:28:32+00:00',
                        ],
                    ],
                },
                {
                    type: 'inventory',
                    meta: {
                        fields: [
                            { name: 'starting', type: 'datetime', label: 'Bin Start' },
                            { name: 'has_data', type: 'bool', label: 'Has Data?' },
                            { name: 'ending', type: 'datetime', label: 'Bin End' },
                            { name: 'count', type: 'int', label: 'Count' },
                            { name: 'size', type: 'int', label: 'Bytes' },
                            { name: 'data_starting', type: 'datetime', label: 'Data Start' },
                            { name: 'data_ending', type: 'datetime', label: 'Data End' },
                        ],
                    },
                    name: 'monthly',
                    values: [
                        [
                            '2022-06-01 00:00:00+00:00',
                            1,
                            '2022-06-30 00:00:00+00:00',
                            7,
                            2515720,
                            '2022-06-02 18:37:59+00:00',
                            '2022-06-03 16:28:32+00:00',
                        ],
                    ],
                },
            ],
        },
    ],
};

export const EmptyInventory = Template.bind({});
EmptyInventory.args = {
    availTabs: [
        {
            key: 'northinlet-one-minute-stills-s3',
            label: 'northinlet-one-minute-stills-s3',
            serviceUuid: '70714572-3436-45ef-b4f9-1df59e5c293f',
            icon: <IconCamera size={4} extraClasses='inline-block pr-1 align-bottom' paddingx={0} />,
            galleryComponent: (date, empty) => {
                return (
                    <MediaGallery
                        key={`${date.toISOString()}`}
                        apiUrl='https://app.stage.webcoos.org/webcoos/api'
                        serviceUuid='70714572-3436-45ef-b4f9-1df59e5c293f'
                        selectedDate={date}
                        empty={empty}
                        iconComponent={
                            <IconCamera size={4} extraClasses='inline-block pr-1 align-bottom' paddingx={0} />
                        }
                        zoomedComponent={(zoomed, onClick) => (
                            <img
                                className='object-contain'
                                src={zoomed.data.properties.url}
                                alt={zoomed.data.dateTimeStr}
                                onClick={onClick}
                            />
                        )}
                    />
                );
            },
            inventory: [
            ]
        }
    ]
}