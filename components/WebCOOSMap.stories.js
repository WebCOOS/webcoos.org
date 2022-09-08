import React from 'react';
import { withReactContext } from 'storybook-react-context';

import WebCOOSMap from './WebCOOSMap';
import ApiContext from './contexts/ApiContext';
import MapboxContext from './contexts/MapboxContext';

export default {
    component: WebCOOSMap,
    title: 'WebCOOSMap',
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
        withReactContext({
            Context: MapboxContext,
            initialState: process.env.STORYBOOK_MAPBOX_TOKEN,
        }),
    ],
};

const Template = (args) => {
    return (
        <WebCOOSMap {...args} />
    );
};

export const Default = Template.bind({});
Default.args = {
    longitude: -75.8139,
    latitude: 36.3388,
    stationSlugs: [
        'buxtoncoastalcam',
        'cherrypiernorthcam',
        'cherrypiersouthcam',
        'cms_dock_north',
        'cms_dock_south',
        'currituck_hampton_inn',
        'currituck_sailfish',
        'folly6thavenue',
        'follypiernorthcam',
        'follypiersouthcam',
        'miami40thcam',
        'northinlet',
        'oakisland_east',
        'oakisland_west',
        'rosemontpeace',
        'rosemontpeonie',
        'staugustinecam',
        'tmmc_prls',
        'twinpierscam',
        'waikiki_sheraton',
    ],
};

export const Select = Template.bind({});
Select.args = {
    longitude: -75.8139,
    latitude: 36.3388,
    stationSlugs: ['currituck_hampton_inn', 'northinlet', 'oakisland_east'],
};