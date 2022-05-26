import React from 'react';

import WebCOOSMap from './WebCOOSMap';

export default {
    component: WebCOOSMap,
    title: 'WebCOOSMap',
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
    apiUrl: 'https://app.stage.webcoos.org/webcoos/api',
    apiVersion: 'v1',
    token: '219ec2bd77f37ce8bbb12e4c08a7b62bd506a7d3',
    source: 'webcoos',
};

export const Select = Template.bind({});
Select.args = {
    longitude: -75.8139,
    latitude: 36.3388,
    stationSlugs: ['currituck_hampton_inn', 'northinlet', 'oakisland_east'],
    apiUrl: 'https://app.stage.webcoos.org/webcoos/api',
    apiVersion: 'v1',
    token: '219ec2bd77f37ce8bbb12e4c08a7b62bd506a7d3',
    source: 'webcoos',
};