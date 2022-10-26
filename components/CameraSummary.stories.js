import React from 'react';
import { withReactContext } from 'storybook-react-context';

import CameraSummary from './CameraSummary';
import MapboxContext from './contexts/MapboxContext';

export default {
    component: CameraSummary,
    title: 'CameraSummary',
    decorators: [
        withReactContext({
            Context: MapboxContext,
            initialState: process.env.STORYBOOK_MAPBOX_TOKEN,
        }),
    ],
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


export const WithServiceButtons = Template.bind({});
WithServiceButtons.args = {
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
    services: [
        {
            uuid: '4c7d9759-9be8-46cd-8da2-d68704aeb730',
            created_at: '2022-03-18T19:02:34.716373Z',
            updated_at: '2022-03-21T16:30:32.273996Z',
            attrs: {},
            data: {
                kind: 'Service',
                type: 'S3Service',
                uuid: '4c7d9759-9be8-46cd-8da2-d68704aeb730',
                common: {
                    slug: 'currituck_sailfish-image-stills-s3',
                    label: 'currituck_sailfish-image-stills-s3',
                    comments: '',
                    description: '',
                },
                system: 'webcoos.s3service',
                version: '1.0.0',
                uuid_slug: 'FcjbaarC',
                uuid_type: 'service',
                properties: {
                    url:
                        'https://s3.stage.webcoos.org/webcoos/sources/webcoos/groups/…sailfish/feeds/raw-video-data/products/image-stills/elements',
                    path:
                        'sources/webcoos/groups/noaa/assets/currituck_sailfish/feeds/raw-video-data/products/image-stills/elements',
                    bucket: 'webcoos',
                    region: '',
                    base_url: 'https://s3.stage.webcoos.org',
                },
            },
            elements: {
                count: 106,
                size: 23533771,
                first_starting: '2022-02-03T00:04:56Z',
                last_starting: '2022-02-03T01:49:46Z',
                first_ending: null,
                last_ending: null,
            },
        },
        {
            uuid: '1d130de0-f99b-436d-b96a-c3929904b335',
            created_at: '2022-03-18T19:03:05.561524Z',
            updated_at: '2022-03-21T16:30:32.275552Z',
            attrs: {},
            data: {
                kind: 'Service',
                type: 'S3Service',
                uuid: '1d130de0-f99b-436d-b96a-c3929904b335',
                common: {
                    slug: 'currituck_sailfish-video-archive-s3',
                    label: 'currituck_sailfish-video-archive-s3',
                    comments: '',
                    description: '',
                },
                system: 'webcoos.s3service',
                version: '1.0.0',
                uuid_slug: '7Brw8a8Y',
                uuid_type: 'service',
                properties: {
                    url:
                        'https://s3.stage.webcoos.org/webcoos/sources/webcoos/groups/…ailfish/feeds/raw-video-data/products/video-archive/elements',
                    path:
                        'sources/webcoos/groups/noaa/assets/currituck_sailfish/feeds/raw-video-data/products/video-archive/elements',
                    bucket: 'webcoos',
                    region: '',
                    base_url: 'https://s3.stage.webcoos.org',
                },
            },
            elements: {
                count: 14,
                size: 881965275,
                first_starting: '2022-02-03T00:00:47Z',
                last_starting: '2022-05-03T09:34:31Z',
                first_ending: null,
                last_ending: null,
            },
        },
        {
            uuid: '714a2eab-73c8-452f-800c-76e809e9a476',
            created_at: '2022-03-18T20:23:21.260381Z',
            updated_at: '2022-03-21T16:30:32.272286Z',
            attrs: {},
            data: {
                kind: 'Service',
                type: 'StreamingService',
                uuid: '714a2eab-73c8-452f-800c-76e809e9a476',
                common: { slug: 'currituck-streams', label: 'currituck-streams', comments: '', description: '' },
                system: 'webcoos.streamingservice',
                version: '1.0.0',
                uuid_slug: 'NAvwNBxR',
                uuid_type: 'service',
                properties: {
                    connections: [
                        {
                            url: 'https://stage-ams.srv.axds.co/stream/adaptive/noaa/currituck_sailfish/manifest.mpd',
                            name: 'Dash',
                            port: 80,
                            protocol: 'dash',
                        },
                        {
                            url: 'https://stage-ams.srv.axds.co/stream/adaptive/noaa/currituck_sailfish/hls.m3u8',
                            name: 'HLS',
                            port: 80,
                            protocol: 'hls',
                        },
                    ],
                },
            },
            elements: {
                count: 0,
                size: null,
                first_starting: null,
                last_starting: null,
                first_ending: null,
                last_ending: null,
            },
        },
    ],
    cameraSvcDataLink: (cameraSlug, serviceProps) => {
        return (
            <button key={cameraSlug} className='bg-white p-4 border-2 border-primary'>
                {serviceProps.common.label}
            </button>
        );
    },
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

export const WithWedge = Template.bind({});
WithWedge.args = {
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
    wedge: {
        type: 'Polygon',
        coordinates: [
            [
                [-78.2243, 33.9126],
                [-78.25661535992131, 33.91023851804379],
                [-78.25661535992131, 33.91023851804379],
                [-78.25624510839664, 33.90789931092975],
                [-78.25563177530478, 33.90559590747116],
                [-78.2547800468986, 33.9033458344184],
                [-78.25369642198577, 33.90116621138485],
                [-78.2523891619639, 33.899073620702325],
                [-78.25086822751113, 33.897083981399405],
                [-78.24914520242659, 33.89521242825621],
                [-78.24723320521136, 33.893473196849726],
                [-78.2451467890704, 33.891879515457646],
                [-78.24290183110155, 33.890443504635826],
                [-78.2243, 33.9126],
            ],
        ],
    },
};

export const EmbeddedVideo = Template.bind({});
EmbeddedVideo.args = {
    uuid: 'f2149aa8-383e-4820-9900-baf2bbb70da3',
    slug: 'georgetownscmm',
    label: 'georgetownscmm',
    description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    source: 'WebCOOS',
    group: 'NOAA',
    longitude: -79.2837,
    latitude: 33.366,
    hls_url: null,
    dash_url: null,
    embed_url: "https://g1.ipcamlive.com/player/player.php?alias=631de96cbcbb2&autoplay=1",
    embedAttrs: null,
    thumbnail:
            'https://s3.axds.co/static-assets/webcoos/backend/stage/media/cache/uploads/camera/georgetownscmm/georgetownscmm_highlight-crop-c0-5__0-5-800x400-70.jpg',
    thumbnails: {
        lqip: '/9j//gAQTGF2YzU5LjE4LjEwMAD/2wBDAAgeHiMeIykpKSkpKTAtMDIyMjAwMDAyMjI2NjY/Pz82NjYyMjY2PDw/P0VHRUFBP0FHR0tLS1paVlZpaWyBgZv/xAB4AAADAQEBAQAAAAAAAAAAAAAEBgUDAgEHAQADAQEAAAAAAAAAAAAAAAAFAQQCABAAAQIDBQUHBQEAAAAAAAAAAQIAESEDMaGRFBJxBOHRgbHBYUFRUjJyBSLiUyMRAAIDAQEBAQAAAAAAAAAAAAABExESAkFhIf/AABEIAB4AKAMBIgACEQADEQD/2gAMAwEAAhEDEQA/ABSl46C6h3mgLNR2Ac2Lm6f813M1JyDssD0nxeJQXTzQIlSPUv3MRkKc9vB9Ivo8sk6H3oLNXXKROmB14Bzs0faMP2akRnDB4mQsjY8xONkvKMO4ty+4oCFIKQmcoQ5P5j/rH5BP0hhrCZcJ6epMu3k9qdVIiE1JysEbz3MiluIUApaibzfybUaCU/CW0RvkXM+iihFqABR/IkgWeWLBifDHg2te5KXFQUEn0mQXMydT3pwcr/fTNM//2Q==',
        rect_large:
            'https://s3.axds.co/static-assets/webcoos/backend/stage/media/cache/uploads/camera/georgetownscmm/georgetownscmm_highlight-crop-c0-5__0-5-800x400-70.jpg',
        rect_small:
            'https://s3.axds.co/static-assets/webcoos/backend/stage/media/cache/uploads/camera/georgetownscmm/georgetownscmm_highlight-crop-c0-5__0-5-200x100-70.jpg',
        rect_medium:
            'https://s3.axds.co/static-assets/webcoos/backend/stage/media/cache/uploads/camera/georgetownscmm/georgetownscmm_highlight-crop-c0-5__0-5-400x200-70.jpg',
        square_large:
            'https://s3.axds.co/static-assets/webcoos/backend/stage/media/cache/uploads/camera/georgetownscmm/georgetownscmm_highlight-crop-c0-5__0-5-800x800-70.jpg',
        square_small:
            'https://s3.axds.co/static-assets/webcoos/backend/stage/media/cache/uploads/camera/georgetownscmm/georgetownscmm_highlight-crop-c0-5__0-5-200x200-70.jpg',
        square_medium:
            'https://s3.axds.co/static-assets/webcoos/backend/stage/media/cache/uploads/camera/georgetownscmm/georgetownscmm_highlight-crop-c0-5__0-5-400x400-70.jpg',
    },
};

export const EmbeddedVideoWithAttrs = Template.bind({});
EmbeddedVideoWithAttrs.args = {
    uuid: 'f2149aa8-383e-4820-9900-baf2bbb70da3',
    slug: 'georgetownscmm',
    label: 'georgetownscmm',
    description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    source: 'WebCOOS',
    group: 'NOAA',
    longitude: -79.2837,
    latitude: 33.366,
    hls_url: null,
    dash_url: null,
    embed_url: 'https://g1.ipcamlive.com/player/player.php?alias=631de96cbcbb2&autoplay=1',
    embedAttrs: {
        width: '300px',
        height: '200px',
    },
    thumbnail:
        'https://s3.axds.co/static-assets/webcoos/backend/stage/media/cache/uploads/camera/georgetownscmm/georgetownscmm_highlight-crop-c0-5__0-5-800x400-70.jpg',
    thumbnails: {
        lqip: '/9j//gAQTGF2YzU5LjE4LjEwMAD/2wBDAAgeHiMeIykpKSkpKTAtMDIyMjAwMDAyMjI2NjY/Pz82NjYyMjY2PDw/P0VHRUFBP0FHR0tLS1paVlZpaWyBgZv/xAB4AAADAQEBAQAAAAAAAAAAAAAEBgUDAgEHAQADAQEAAAAAAAAAAAAAAAAFAQQCABAAAQIDBQUHBQEAAAAAAAAAAQIAESEDMaGRFBJxBOHRgbHBYUFRUjJyBSLiUyMRAAIDAQEBAQAAAAAAAAAAAAABExESAkFhIf/AABEIAB4AKAMBIgACEQADEQD/2gAMAwEAAhEDEQA/ABSl46C6h3mgLNR2Ac2Lm6f813M1JyDssD0nxeJQXTzQIlSPUv3MRkKc9vB9Ivo8sk6H3oLNXXKROmB14Bzs0faMP2akRnDB4mQsjY8xONkvKMO4ty+4oCFIKQmcoQ5P5j/rH5BP0hhrCZcJ6epMu3k9qdVIiE1JysEbz3MiluIUApaibzfybUaCU/CW0RvkXM+iihFqABR/IkgWeWLBifDHg2te5KXFQUEn0mQXMydT3pwcr/fTNM//2Q==',
        rect_large:
            'https://s3.axds.co/static-assets/webcoos/backend/stage/media/cache/uploads/camera/georgetownscmm/georgetownscmm_highlight-crop-c0-5__0-5-800x400-70.jpg',
        rect_small:
            'https://s3.axds.co/static-assets/webcoos/backend/stage/media/cache/uploads/camera/georgetownscmm/georgetownscmm_highlight-crop-c0-5__0-5-200x100-70.jpg',
        rect_medium:
            'https://s3.axds.co/static-assets/webcoos/backend/stage/media/cache/uploads/camera/georgetownscmm/georgetownscmm_highlight-crop-c0-5__0-5-400x200-70.jpg',
        square_large:
            'https://s3.axds.co/static-assets/webcoos/backend/stage/media/cache/uploads/camera/georgetownscmm/georgetownscmm_highlight-crop-c0-5__0-5-800x800-70.jpg',
        square_small:
            'https://s3.axds.co/static-assets/webcoos/backend/stage/media/cache/uploads/camera/georgetownscmm/georgetownscmm_highlight-crop-c0-5__0-5-200x200-70.jpg',
        square_medium:
            'https://s3.axds.co/static-assets/webcoos/backend/stage/media/cache/uploads/camera/georgetownscmm/georgetownscmm_highlight-crop-c0-5__0-5-400x400-70.jpg',
    },
};