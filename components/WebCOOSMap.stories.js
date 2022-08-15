import React from 'react';
import { withReactContext } from 'storybook-react-context';

import WebCOOSMap from './WebCOOSMap';
import ApiContext from './contexts/ApiContext';

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
                source: 'webcoos'
            },
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
        'buxton',
        'cherrypier_north',
        'cherrypier_south',
        'currituck_hampton_inn',
        'currituck_sailfish',
        'follypier_north',
        'follypier_south',
        'miami40th',
        'northinlet',
        'oakisland_east',
        'oakisland_west',
        'staugustinepier',
        'twinpier',
    ],
};

export const Select = Template.bind({});
Select.args = {
    longitude: -75.8139,
    latitude: 36.3388,
    stationSlugs: ['currituck_hampton_inn', 'northinlet', 'oakisland_east'],
};