import React from 'react';
import { withReactContext } from 'storybook-react-context';

import MediaGallery from './MediaGallery';
import {IconCamera, IconVideoCamera} from './Icon';
import ApiContext from './contexts/ApiContext';

export default {
    component: MediaGallery,
    title: 'MediaGallery',
    decorators: [
        withReactContext({
            Context: ApiContext,
            initialState: {
                apiUrl: 'https://app.stage.webcoos.org/webcoos/api',
                apiVersion: 'v1',
                token: process.env.STORYBOOK_WEBCOOS_API_TOKEN,
                source: 'webcoos',
            },
        }),
    ],
};

const VideoTemplate = (args) => (
    <MediaGallery
        {...args}
        iconComponent={<IconVideoCamera size={4} extraClasses='inline-block pr-1 align-bottom' paddingx={0} />}
        zoomedComponent={(zoomed, onClick) => (
            <video className='object-contain border' controls muted autoPlay playsInline>
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
    serviceUuid: 'currituck_sailfish-image-stills-s3',
};

export const ImageSortDesc = ImgTemplate.bind({});
ImageSortDesc.args = {
    serviceUuid: 'currituck_sailfish-image-stills-s3',
    sortDescending: true
};

export const ImageVerticallyConstrained = ImgTemplate.bind({});
ImageVerticallyConstrained.args = {
    serviceUuid: 'currituck_sailfish-image-stills-s3',
    galleryClasses: 'max-h-96 overflow-y-auto',
};

export const ImageSpecificDay = ImgTemplate.bind({});
ImageSpecificDay.args = {
    serviceUuid: 'currituck_sailfish-image-stills-s3',
    selectedDate: new Date('2022-05-08T00:00:00+00:00'),
};

export const VideoDefault = VideoTemplate.bind({});
VideoDefault.args = {
    perPage: 8,
    serviceUuid: 'currituck_sailfish-video-archive-s3',
};

export const EmptyGallery = ImgTemplate.bind({});
EmptyGallery.args = {
    empty: true
};
