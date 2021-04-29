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
                    lighter: '#d5e1e6',
                    DEFAULT: '#32899e',
                    darker: '#123c49',
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
