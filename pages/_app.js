import '../styles/globals.css';
import ApiContext from '../components/contexts/ApiContext';

function MyApp({ Component, pageProps }) {
    return (
        <ApiContext.Provider
            value={{
                apiUrl: process.env.NEXT_PUBLIC_WEBCOOS_API_URL || 'https://app.stage.webcoos.org/webcoos/api',
                apiVersion: process.env.NEXT_PUBLIC_WEBCOOS_API_VERSION || 'v1',
                source: process.env.NEXT_PUBLIC_WEBCOOS_SOURCE || 'webcoos',
                token: process.env.NEXT_PUBLIC_WEBCOOS_API_TOKEN
            }}
        >
            <Component {...pageProps} />;
        </ApiContext.Provider>
    );
}

export default MyApp;
