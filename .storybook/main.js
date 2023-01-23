const path = require('path');

module.exports = {
    core: {
        builder: 'webpack5'
    },
    stories: ['../components/**/*.stories.mdx', '../components/**/*.stories.@(js|jsx|ts|tsx)'],
    addons: [
        '@storybook/addon-links',
        '@storybook/addon-essentials',
        // thank you aaron!
        // https://stackoverflow.com/a/68605148/84732
        {
            name: '@storybook/addon-postcss',
            options: {
                postcssLoaderOptions: {
                    implementation: require('postcss'),
                },
            },
        },
    ],
};
