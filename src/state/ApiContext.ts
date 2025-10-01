import apiContextDefault from '@/state/apiContextDefault';
import React, {useContext} from 'react';

const ApiContext = React.createContext(apiContextDefault);

export default ApiContext;

export function useAPIContext() {
    return useContext(ApiContext);
}