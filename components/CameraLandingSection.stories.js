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
    token: "219ec2bd77f37ce8bbb12e4c08a7b62bd506a7d3",
    source: "webcoos"
};
