const apiContextDefault = {
    apiUrl: import.meta.env.VITE_PUBLIC_WEBCOOS_API_URL,
    apiVersion: 'v1',
    source: 'webcoos',
    token: import.meta.env.VITE_PUBLIC_WEBCOOS_API_TOKEN,
}

export default apiContextDefault;