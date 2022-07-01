import React from 'react';

import TabbedGallery from './TabbedGallery';
import { IconCamera, IconVideoCamera } from './Icon';

import StillsGallery from './StillsGallery';
import VideoGallery from './VideoGallery';

export default {
    component: TabbedGallery,
    title: 'TabbedGallery',
};

const Template = (args) => (
    <div className='max-w-4xl'>
        <TabbedGallery {...args} />
    </div>
);

export const Default = Template.bind({});
Default.args = {
    availTabs: [
        {
            key: 'stills',
            icon: <IconCamera size={4} extraClasses='inline-block pr-1 align-bottom' paddingx={0} />,
            galleryComponent: (date) => {
                return (
                    <StillsGallery
                        apiUrl='https://app.stage.webcoos.org/webcoos/api'
                        apiVersion='v1'
                        token='219ec2bd77f37ce8bbb12e4c08a7b62bd506a7d3'
                        serviceUuid='b7114ae2-b2cb-40fe-af33-820db2db7755' // currituck sailfish one minute stills
                        selectedDate={date}
                    />
                );
            }
        },
        {
            key: 'videos',
            icon: <IconVideoCamera size={4} extraClasses='inline-block pr-1 align-bottom' paddingx={0} />,
            galleryComponent: () => <div>videoveos</div>,
        },
    ],
};
