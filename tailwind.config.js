module.exports = {
    purge: [
        './pages/**/*.{js,ts,jsx,tsx}',
        './components/**/*.{js,ts,jsx,tsx}',
        './node_modules/@axds/landing-page-components/**/*.{js,ts,jsx,tsx}',
    ],
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
            colors: {
                primary: {
                    lighter: '#e5e5e5',
                    DEFAULT: '#4c4c4c',
                    darker: '#000000',
                },
                secondary: {
                    lighter: '#8aa8e6',
                    DEFAULT: '#002b80',
                    darker: '#001133',
                },
            },
        },
    },
    variants: {
        extend: {},
    },
    plugins: [require('@tailwindcss/typography')],
};
