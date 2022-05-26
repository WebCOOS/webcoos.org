import React from 'react';

import StillsGallery from './StillsGallery';

export default {
    component: StillsGallery,
    title: 'StillsGallery',
};

const Template = (args) => <StillsGallery {...args} />;

export const Default = Template.bind({});
Default.args = {
    apiUrl: 'https://app.stage.webcoos.org/webcoos/api',
    apiVersion: 'v1',
    token: '219ec2bd77f37ce8bbb12e4c08a7b62bd506a7d3',
    serviceUuid: 'b7114ae2-b2cb-40fe-af33-820db2db7755', // currituck sailfish one minute stills
};

export const VerticallyConstrained = Template.bind({});
VerticallyConstrained.args = {
    apiUrl: 'https://app.stage.webcoos.org/webcoos/api',
    apiVersion: 'v1',
    token: '219ec2bd77f37ce8bbb12e4c08a7b62bd506a7d3',
    serviceUuid: 'b7114ae2-b2cb-40fe-af33-820db2db7755', // currituck sailfish one minute stills
    galleryClasses: "max-h-96 overflow-y-auto"
};