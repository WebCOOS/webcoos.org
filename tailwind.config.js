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
            gridTemplateColumns: {
                // camera layout
                camera: '2.5fr 4.5fr 2.5fr',
            },
            maxWidth: {
                '75w': '75vw',
            },
        },
    },
    variants: {
        extend: {
            borderRadius: ['hover'],
        },
    },
    plugins: [require('@tailwindcss/typography')],
};
