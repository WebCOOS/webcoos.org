module.exports = {
    purge: {
        content: [
            './pages/**/*.{js,ts,jsx,tsx}',
            './components/**/*.{js,ts,jsx,tsx}',
            './node_modules/@axdspub/landing-page-components/**/*.{js,ts,jsx,tsx}',
            './md-content/**/*.md'
        ],
        safelist: [
            'bg-green-500',
            'text-green-100',
            'bg-gray-400',
            'text-gray-800',
            'border-green-700',
            'border-gray-800',
            'border-gray-500',
            'max-w-none',
            'bg-purple-900'
        ]
    },
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
            height: {
                '128': '32rem',
            }
        },
    },
    variants: {
        extend: {
            display: ['group-hover'],
            borderRadius: ['hover'],
        },
    },
    plugins: [require('@tailwindcss/typography')],
};
