import React, { useEffect } from 'react';
import CameraSummary from './CameraSummary';
import { useAPIContext } from './contexts/ApiContext';
import { parseWebCOOSAsset } from './utils/webCOOSHelpers';

export default function CameraLandingSection({
    stations = [],
}) {
    const { apiUrl, apiVersion, token, source } = useAPIContext();
    const [cameras, setCameras] = React.useState([]);

    useEffect(() => {
        fetch(`${apiUrl}/${apiVersion}/assets/?source=${source}`, {
            headers: {
                Authorization: `Token ${token}`,
                Accept: 'application/json',
            },
        })
            .then((response) => response.json())
            .then((result) => {
                const parsedCams = result.results.map((item) => {
                        const parsedItem = parseWebCOOSAsset(item);
                        if (!parsedItem) {
                            return null;
                        }
                        return parsedItem;
                    }),
                    filteredCams = parsedCams.filter((pc) => pc !== null);

                if (stations.length) {
                    const stationSet = new Set(stations);
                    setCameras(filteredCams.filter((fc) => stationSet.has(fc.slug)));
                } else {
                    setCameras(filteredCams);
                }
            });
    }, []);

    return (
        <div>
            {cameras.map((cam, idx) => (
                <CameraSummary key={cam.uuid} {...cam} alt_bg={!!(idx % 2)} has_bottom={idx == cameras.length - 1} />
            ))}
        </div>
    );
}
