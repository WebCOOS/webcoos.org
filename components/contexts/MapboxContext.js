import React, { useContext } from 'react';

const MapboxContext = React.createContext(undefined);

export default MapboxContext;

export function useMapboxContext() {
    return useContext(MapboxContext);
}
