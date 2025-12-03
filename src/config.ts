import { twconfig } from "./twowolves"

const unknownConfigValue: string = "unknown"


export const WEBCOOS_API_TOKEN: string = twconfig(
    "$TWOWOLVES_PUBLIC_WEBCOOS_API_TOKEN",
    "VITE_PUBLIC_WEBCOOS_API_TOKEN",
    unknownConfigValue
);

export const WEBCOOS_API_URL = twconfig(
    "$TWOWOLVES_PUBLIC_WEBCOOS_API_URL",
    "VITE_PUBLIC_WEBCOOS_API_URL",
    unknownConfigValue
);

export const APP_MAPBOX_TOKEN = twconfig(
    "$TWOWOLVES_APP_MAPBOX_TOKEN",
    "VITE_APP_MAPBOX_TOKEN",
    unknownConfigValue
);

export const FEEDBACK_URL = twconfig(
    "$TWOWOLVES_PUBLIC_FEEDBACK_URL",
    "VITE_PUBLIC_FEEDBACK_URL",
    unknownConfigValue
);
