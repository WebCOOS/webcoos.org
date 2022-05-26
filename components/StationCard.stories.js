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
