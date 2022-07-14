import React from 'react';

import CameraLandingSection from './CameraLandingSection';

export default {
    component: CameraLandingSection,
    title: 'CameraLandingSection',
};

const Template = (args) => <CameraLandingSection {...args} />;

export const Default = Template.bind({});
Default.args = {
    apiUrl: "https://app.stage.webcoos.org/webcoos/api",
    apiVersion: "v1",
    source: "webcoos"
};
