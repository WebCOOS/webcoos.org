import React from 'react';
import { withReactContext } from 'storybook-react-context';

import GLMap from './GLMap';
import MapboxContext from './contexts/MapboxContext';

export default {
    component: GLMap,
    title: 'GLMap',
    decorators: [
        withReactContext({
            Context: MapboxContext,
            initialState: process.env.STORYBOOK_MAPBOX_TOKEN,
        }),
    ],
};

const Template = (args) => {
    return (
        // <div style={{ height: '600px', width: '100%' }}>
        <GLMap {...args} />
    );
}

export const Default = Template.bind({});
Default.args = {
    longitude: -75.8139,
    latitude: 36.3388,
};
