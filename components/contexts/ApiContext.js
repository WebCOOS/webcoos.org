import React, {useContext} from 'react';

const ApiContext = React.createContext({
    apiUrl: undefined,
    apiVersion: 'v1',
    source: 'webcoos',
    token: undefined,
});

export default ApiContext;

export function useAPIContext() {
    return useContext(ApiContext);
}