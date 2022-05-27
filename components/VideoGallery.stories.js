import React from 'react';

import VideoGallery from './VideoGallery';

export default {
    component: VideoGallery,
    title: 'VideoGallery',
};

const Template = (args) => <VideoGallery {...args} />;

export const Default = Template.bind({});
Default.args = {
    apiUrl: 'https://app.stage.webcoos.org/webcoos/api',
    apiVersion: 'v1',
    token: '219ec2bd77f37ce8bbb12e4c08a7b62bd506a7d3',
    perPage: 8,
    serviceUuid: '1c49de59-0195-4222-ae98-76693c99b745', // currituck hampton inn video
};

