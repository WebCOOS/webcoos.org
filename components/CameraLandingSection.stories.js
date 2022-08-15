import React from 'react';
import { withReactContext } from 'storybook-react-context';

import CameraLandingSection from './CameraLandingSection';
import ApiContext from './contexts/ApiContext';

export default {
    component: CameraLandingSection,
    title: 'CameraLandingSection',
    decorators: [
        withReactContext({
            Context: ApiContext,
            initialState: {
                apiUrl: 'https://app.stage.webcoos.org/webcoos/api',
                apiVersion: 'v1',
                token: process.env.STORYBOOK_WEBCOOS_API_TOKEN,
                source: 'webcoos',
            },
        }),
    ],
};

const Template = (args) => <CameraLandingSection {...args} />;

export const Default = Template.bind({});
Default.args = {};
