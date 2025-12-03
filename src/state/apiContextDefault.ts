import { WEBCOOS_API_URL, WEBCOOS_API_TOKEN } from "@/config";

const apiContextDefault = {
    apiUrl: WEBCOOS_API_URL,
    apiVersion: 'v1',
    source: 'webcoos',
    token: WEBCOOS_API_TOKEN,
}

export default apiContextDefault;