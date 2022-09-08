import '../styles/globals.css';
import ApiContext from '../components/contexts/ApiContext';
import MapboxContext from '../components/contexts/MapboxContext';

function MyApp({ Component, pageProps }) {
    return (
        <ApiContext.Provider
            value={{
                apiUrl: process.env.NEXT_PUBLIC_WEBCOOS_API_URL || 'https://app.stage.webcoos.org/webcoos/api',
                apiVersion: process.env.NEXT_PUBLIC_WEBCOOS_API_VERSION || 'v1',
                source: process.env.NEXT_PUBLIC_WEBCOOS_SOURCE || 'webcoos',
                token: process.env.NEXT_PUBLIC_WEBCOOS_API_TOKEN,
            }}
        >
            <MapboxContext.Provider value={process.env.NEXT_PUBLIC_MAPBOX_TOKEN || process.env.REACT_APP_MAPBOX_TOKEN}>
                <Component {...pageProps} />
            </MapboxContext.Provider>
        </ApiContext.Provider>
    );
}

export default MyApp;
