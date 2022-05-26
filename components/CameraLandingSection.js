import React, { useEffect } from 'react';
import CameraSummary from './CameraSummary';
import { parseWebCOOSAsset } from './utils/webCOOSHelpers';

export default function CameraLandingSection({
    apiUrl,
    apiVersion,
    token,
    source,
    mapboxAccessToken = process.env.REACT_APP_MAPBOX_TOKEN || process.env.STORYBOOK_MAPBOX_TOKEN
}) {

    const [cameras, setCameras] = React.useState([]);

    useEffect(() => {
        fetch(
            `${apiUrl}/${apiVersion}/assets/?source=${source}&_nocache=true`,
            {
                headers: {
                    Authorization: `Token ${token}`,
                    Accept: "application/json"
                }
            })
            .then(response => response.json())
            .then(result => {
                const parsedCams = result.results.map(item => {
                    const parsedItem = parseWebCOOSAsset(item);
                    if (!parsedItem) { return null; }
                    return {
                        ...parsedItem,
                        mapboxAccessToken: mapboxAccessToken
                    }
                });
                setCameras(parsedCams.filter(pc => pc !== null));
          })
    }, []);

    return (
        <div>
            {cameras.map((cam, idx) => (
                <CameraSummary key={cam.uuid} {...cam} alt_bg={!!(idx % 2)} has_bottom={idx == cameras.length - 1} />
            ))}
        </div>
    );
}
