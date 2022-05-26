import React from 'react';

import CameraSummary from './CameraSummary';

export default {
    component: CameraSummary,
    title: 'CameraSummary',
};

const Template = (args) => <CameraSummary {...args} />;

export const Default = Template.bind({});
Default.args = {
    uuid: '709a88b8-9809-497e-bfdc-bf8d0ab758da',
    slug: 'currituck_sailfish',
    label: 'Currituck Sailfish',
    description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    source: 'WebCOOS',
    group: 'NOAA',
    longitude: -75.8139,
    latitude: 36.3388,
    thumbnail: 'https://placehold.jp/400x200.png',
    hls_url: 'https://stage-ams.srv.axds.co/stream/adaptive/noaa/currituck_sailfish/hls.m3u8',
    dash_url: 'https://stage-ams.srv.axds.co/stream/adaptive/noaa/currituck_sailfish/manifest.mpd',
};

export const NoVideo = Template.bind({});
NoVideo.args = {
    uuid: '709a88b8-9809-497e-bfdc-bf8d0ab758da',
    slug: 'northinlet',
    label: 'North Inlet',
    description:
        ' Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum eget libero a dui molestie efficitur vitae vel nunc. Donec a ante turpis. Maecenas rutrum in nibh ut porttitor. Cras eleifend enim non magna fringilla pellentesque. Ut suscipit nisi ligula, quis auctor velit commodo nec. Nam sem diam, fermentum vitae leo eu, porttitor cursus libero. Nullam tincidunt ullamcorper orci in pellentesque.',
    source: 'WebCOOS',
    group: 'NERRS',
    longitude: -79.1889,
    latitude: 33.3494,
    thumbnail: 'https://placehold.jp/400x200.png',
};

export const ThumbnailAndVideo = Template.bind({});
ThumbnailAndVideo.args = {
    uuid: '709a88b8-9809-497e-bfdc-bf8d0ab758da',
    slug: 'currituck_sailfish',
    label: 'Currituck Sailfish',
    description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    source: 'WebCOOS',
    group: 'NOAA',
    longitude: -75.8139,
    latitude: 36.3388,
    thumbnail: 'https://placehold.jp/400x200.png',
    hls_url: 'https://stage-ams.srv.axds.co/stream/adaptive/noaa/currituck_sailfish/hls.m3u8',
    dash_url: 'https://stage-ams.srv.axds.co/stream/adaptive/noaa/currituck_sailfish/manifest.mpd',
    thumbnail: 'https://s3.axds.co/static-assets/webcoos/backend/stage/media/cache/uploads/camera/currituck_sailfish/currituck_sailfish_highlight-crop-c0-5__0-5-800x400-70.jpg',
    thumbnails: {
            rect_large:
                'https://s3.axds.co/static-assets/webcoos/backend/stage/media/cache/uploads/camera/currituck_sailfish/currituck_sailfish_highlight-crop-c0-5__0-5-800x400-70.jpg',
            rect_small:
                'https://s3.axds.co/static-assets/webcoos/backend/stage/media/cache/uploads/camera/currituck_sailfish/currituck_sailfish_highlight-crop-c0-5__0-5-200x100-70.jpg',
            rect_medium:
                'https://s3.axds.co/static-assets/webcoos/backend/stage/media/cache/uploads/camera/currituck_sailfish/currituck_sailfish_highlight-crop-c0-5__0-5-400x200-70.jpg',
            square_large:
                'https://s3.axds.co/static-assets/webcoos/backend/stage/media/cache/uploads/camera/currituck_sailfish/currituck_sailfish_highlight-crop-c0-5__0-5-800x800-70.jpg',
            square_small:
                'https://s3.axds.co/static-assets/webcoos/backend/stage/media/cache/uploads/camera/currituck_sailfish/currituck_sailfish_highlight-crop-c0-5__0-5-200x200-70.jpg',
            square_medium:
                'https://s3.axds.co/static-assets/webcoos/backend/stage/media/cache/uploads/camera/currituck_sailfish/currituck_sailfish_highlight-crop-c0-5__0-5-400x400-70.jpg',        
    },
};

export const RealThumbnailsNoVideo = Template.bind({});
RealThumbnailsNoVideo.args = {
    uuid: '860f234c-f070-43f4-b115-ee535d5dd36f',
    slug: 'oakisland_west',
    label: 'oakisland_west',
    description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum eget libero a dui molestie efficitur vitae vel nunc. Donec a ante turpis. Maecenas rutrum in nibh ut porttitor. Cras eleifend enim non magna fringilla pellentesque. Ut suscipit nisi ligula, quis auctor velit commodo nec. Nam sem diam, fermentum vitae leo eu, porttitor cursus libero. Nullam tincidunt ullamcorper orci in pellentesque.',
    group: 'uncw',
    source: 'webcoos',
    longitude: -78.2243,
    latitude: 33.9126,
    thumbnail:
        'https://s3.axds.co/static-assets/webcoos/backend/stage/media/cache/uploads/camera/oakisland_west/oakisland_west_highlight-crop-c0-5__0-5-800x400-70.jpg',
    thumbnails: {
        rect_large:
            'https://s3.axds.co/static-assets/webcoos/backend/stage/media/cache/uploads/camera/oakisland_west/oakisland_west_highlight-crop-c0-5__0-5-800x400-70.jpg',
        rect_small:
            'https://s3.axds.co/static-assets/webcoos/backend/stage/media/cache/uploads/camera/oakisland_west/oakisland_west_highlight-crop-c0-5__0-5-200x100-70.jpg',
        rect_medium:
            'https://s3.axds.co/static-assets/webcoos/backend/stage/media/cache/uploads/camera/oakisland_west/oakisland_west_highlight-crop-c0-5__0-5-400x200-70.jpg',
        square_large:
            'https://s3.axds.co/static-assets/webcoos/backend/stage/media/cache/uploads/camera/oakisland_west/oakisland_west_highlight-crop-c0-5__0-5-800x800-70.jpg',
        square_small:
            'https://s3.axds.co/static-assets/webcoos/backend/stage/media/cache/uploads/camera/oakisland_west/oakisland_west_highlight-crop-c0-5__0-5-200x200-70.jpg',
        square_medium:
            'https://s3.axds.co/static-assets/webcoos/backend/stage/media/cache/uploads/camera/oakisland_west/oakisland_west_highlight-crop-c0-5__0-5-400x400-70.jpg',
    },
};

export const RealThumbnailsTallVideo = Template.bind({});
RealThumbnailsTallVideo.args = {    
  "uuid": "860f234c-f070-43f4-b115-ee535d5dd36f",
  "slug": "oakisland_west",
  "label": "oakisland_west",
  "description": "",
  "source": "webcoos",
  "group": "uncw",
  "longitude": -78.2243,
  "latitude": 33.9126,
  "thumbnail": "https://s3.axds.co/static-assets/webcoos/backend/stage/media/cache/uploads/camera/oakisland_west/oakisland_west_highlight-crop-c0-5__0-5-800x400-70.jpg",
  "hls_url": "https://stage-ams.srv.axds.co/stream/adaptive/uncw/oakisland_west/hls.m3u8",
  "dash_url": "https://stage-ams.srv.axds.co/stream/adaptive/uncw/oakisland_west/manifest.mpd",
  "alt_bg": false
}