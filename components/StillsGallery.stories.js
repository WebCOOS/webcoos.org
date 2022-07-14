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
    serviceUuid: 'b7114ae2-b2cb-40fe-af33-820db2db7755', // currituck sailfish one minute stills
};

export const VerticallyConstrained = Template.bind({});
VerticallyConstrained.args = {
    apiUrl: 'https://app.stage.webcoos.org/webcoos/api',
    apiVersion: 'v1',
    serviceUuid: 'b7114ae2-b2cb-40fe-af33-820db2db7755', // currituck sailfish one minute stills
    galleryClasses: "max-h-96 overflow-y-auto"
};

export const SpecificDay = Template.bind({});
SpecificDay.args = {
    apiUrl: 'https://app.stage.webcoos.org/webcoos/api',
    apiVersion: 'v1',
    serviceUuid: 'b7114ae2-b2cb-40fe-af33-820db2db7755', // currituck sailfish one minute stills
    selectedDate: new Date('2022-05-08T00:00:00+00:00'),
};