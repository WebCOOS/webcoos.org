import React from 'react';

import StationCard from './StationCard';

export default {
    component: StationCard,
    title: 'StationCard',
};

const Template = (args) => {
    return (
        <div className="max-w-4xl">
            <StationCard {...args} />
        </div>
    );
};

export const Default = Template.bind({});
Default.args = {
    uuid: '6d9743ee-fc45-40f7-b363-4b08398c839d',
    slug: 'follypier_north',
    label: 'follypier_north',
    description: 'Folly Beach Pier Northside',
    source: 'webcoos',
    group: 'surfline',
    longitude: -79.94106880950928,
    latitude: 32.65478320819984,
    thumbnail:
        'https://s3.axds.co/static-assets/webcoos/backend/stage/media/cache/uploads/camera/follypier_north/follypier_north_highlight-crop-c0-5__0-5-800x400.png',
    thumbnails: {
        rect_large:
            'https://s3.axds.co/static-assets/webcoos/backend/stage/media/cache/uploads/camera/follypier_north/follypier_north_highlight-crop-c0-5__0-5-800x400.png',
        rect_small:
            'https://s3.axds.co/static-assets/webcoos/backend/stage/media/cache/uploads/camera/follypier_north/follypier_north_highlight-crop-c0-5__0-5-200x100.png',
        rect_medium:
            'https://s3.axds.co/static-assets/webcoos/backend/stage/media/cache/uploads/camera/follypier_north/follypier_north_highlight-crop-c0-5__0-5-400x200.png',
        square_large:
            'https://s3.axds.co/static-assets/webcoos/backend/stage/media/cache/uploads/camera/follypier_north/follypier_north_highlight-crop-c0-5__0-5-800x800.png',
        square_small:
            'https://s3.axds.co/static-assets/webcoos/backend/stage/media/cache/uploads/camera/follypier_north/follypier_north_highlight-crop-c0-5__0-5-200x200.png',
        square_medium:
            'https://s3.axds.co/static-assets/webcoos/backend/stage/media/cache/uploads/camera/follypier_north/follypier_north_highlight-crop-c0-5__0-5-400x400.png',
    },
};


export const WithVideo = Template.bind({});
WithVideo.args = {
    uuid: '860f234c-f070-43f4-b115-ee535d5dd36f',
    slug: 'oakisland_west',
    label: 'oakisland_west',
    description: '',
    source: 'webcoos',
    group: 'uncw',
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
    hls_url: 'https://stage-ams.srv.axds.co/stream/adaptive/uncw/oakisland_west/hls.m3u8',
    dash_url: 'https://stage-ams.srv.axds.co/stream/adaptive/uncw/oakisland_west/manifest.mpd',
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
    embed_url: 'https://g1.ipcamlive.com/player/player.php?alias=631de96cbcbb2&autoplay=1',
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


