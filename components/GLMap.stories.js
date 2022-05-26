import React from 'react';

import GLMap from './GLMap';

export default {
    component: GLMap,
    title: 'GLMap',
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
