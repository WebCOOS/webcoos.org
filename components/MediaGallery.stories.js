import React from 'react';

import MediaGallery from './MediaGallery';
import {IconCamera, IconVideoCamera} from './Icon';

export default {
    component: MediaGallery,
    title: 'MediaGallery',
};

const VideoTemplate = (args) => (
    <MediaGallery
        {...args}
        iconComponent={<IconVideoCamera size={4} extraClasses='inline-block pr-1 align-bottom' paddingx={0} />}
        zoomedComponent={(zoomed, onClick) => (
            <video className='object-contain' controls onClick={onClick}>
                <source src={zoomed.data.properties.url} type='video/mp4' />
            </video>
        )}
    />
);

const ImgTemplate = (args) => (
    <MediaGallery
        {...args}
        iconComponent={<IconCamera size={4} extraClasses='inline-block pr-1 align-bottom' paddingx={0} />}
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

export const ImageDefault = ImgTemplate.bind({});
ImageDefault.args = {
    apiUrl: 'https://app.stage.webcoos.org/webcoos/api',
    apiVersion: 'v1',
    serviceUuid: 'b7114ae2-b2cb-40fe-af33-820db2db7755', // currituck sailfish one minute stills
};

export const ImageVerticallyConstrained = ImgTemplate.bind({});
ImageVerticallyConstrained.args = {
    apiUrl: 'https://app.stage.webcoos.org/webcoos/api',
    apiVersion: 'v1',
    serviceUuid: 'b7114ae2-b2cb-40fe-af33-820db2db7755', // currituck sailfish one minute stills
    galleryClasses: 'max-h-96 overflow-y-auto',
};

export const ImageSpecificDay = ImgTemplate.bind({});
ImageSpecificDay.args = {
    apiUrl: 'https://app.stage.webcoos.org/webcoos/api',
    apiVersion: 'v1',
    serviceUuid: 'b7114ae2-b2cb-40fe-af33-820db2db7755', // currituck sailfish one minute stills
    selectedDate: new Date('2022-05-08T00:00:00+00:00'),
};

export const VideoDefault = VideoTemplate.bind({});
VideoDefault.args = {
    apiUrl: 'https://app.stage.webcoos.org/webcoos/api',
    apiVersion: 'v1',
    perPage: 8,
    serviceUuid: '1c49de59-0195-4222-ae98-76693c99b745', // currituck hampton inn video
};
