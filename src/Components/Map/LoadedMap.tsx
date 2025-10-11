import type { IWebCOOSMapAsset } from '@/services/assets/types'
import { LatLonBounds, openlayers as Map } from '@axdspub/axiom-maps'
import type { ReactElement } from 'react'


const LoadedMap = ({data}: {data: IWebCOOSMapAsset[]}): ReactElement => {
    const geoJson =  data.map(d => {
        return {
            type: 'Feature',
            properties: {
                name: d.asset_label,
                description: d.asset_description,
                color: d.asset_disposition_slug === 'archived' ? 'gray' : (d.asset_disposition_slug === 'up' ? 'green' : 'red'),
                stroke: 'white',
                'stroke-width': 2,
                'point-radius': 5
            },
            geometry: {
                type: 'Point',
                coordinates: d.asset_location.coordinates
            }
        }
    })
    const lats = data.map(d => d.asset_location.coordinates[1])
    const lons = data.map(d => d.asset_location.coordinates[0])
    const minLat = Math.min(...lats)
    const maxLat = Math.max(...lats)
    const minLon = Math.min(...lons)
    const maxLon = Math.max(...lons)
    return <Map.MapComponent 
        className='h-full' 
        height='100%'
        onMapLoaded = {(e) => {
            if(e.data?.map === undefined) return
            e.data.map.setBounds(
                new LatLonBounds({
                    sw:{lat: minLat, lon: minLon},
                    ne:{lat: maxLat, lon: maxLon}
                }),
                {
                    padding: {
                        top: 100,
                        bottom: 100,
                        left: 100,
                        right: 100
                    }
                }
            )
        }}
        layers={[
            {
                id: 'assets',
                type: 'geoJson',
                options: {
                    geoJson
                },
                label: '',
                zIndex: 0,
                isBaseLayer: false
            }
        ]}
        
        />
}

export default LoadedMap