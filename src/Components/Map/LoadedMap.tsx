import CameraDetail from '@/Pages/CameraDetail/CameraDetail'
import type { IMapViewProps, IWebCOOSMapAsset } from '@/services/assets/types'
import { type IMap, LatLonBounds, MapLoader, type IGeoJSONLayerProps, type ILayerQueryEvent, type ILatLon } from '@axdspub/axiom-maps'
import { Loader, utils } from '@axdspub/axiom-ui-utilities'
import { useEffect, useLayoutEffect, useRef, useState, type ReactElement } from 'react'
import LatestImage from '../Media/LatestImage'
import { Link } from 'react-router'


const legendItems = [
    {
        id: 'active',
        label: 'Active',
        color: 'bg-primary',
        hexColor: '#32899e',
        filter: (asset: IWebCOOSMapAsset) => asset.asset_disposition_slug === 'up'
    },
    {
        id: 'archived',
        label: 'Archived',
        color: 'bg-primary-lighter',
        hexColor: '#a0cbe0',
        filter: (asset: IWebCOOSMapAsset) => asset.asset_disposition_slug === 'archived'
    },
    {
        id: 'live',
        label: 'Live',
        color: 'bg-green-500',
        hexColor: '#00FF00',
        filter: (asset: IWebCOOSMapAsset) => asset.asset_disposition_label === 'up'
    },
    {
        id: 'pending',
        label: 'Pending',
        color: 'bg-gray-500',
        hexColor: '#808080',
        filter: (asset: IWebCOOSMapAsset) => asset.asset_disposition_label === 'pending'
    },
    {
        id: 'down',
        label: 'Down',
        color: 'bg-red-500',
        hexColor: '#FF0000',
        filter: (asset: IWebCOOSMapAsset) => asset.asset_disposition_label === 'down'
    }
]


const HoverView = ({
    properties,
    point
}: {
    properties: IWebCOOSMapAsset,
    point: { x: number; y: number }
}): ReactElement => {
    const ref = useRef<HTMLDivElement>(null);
    const pop_w = 300

    const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 })

    const updatePosition = (pop_h: number) => {
        const edgeOffset = 20
        const pointOffset = 30
        const w = window.innerWidth
        const h = window.innerHeight
        const pointX = point?.x ?? 0
        const pointY = point?.y ?? 0
        const x = (pointX + pointOffset + pop_w + edgeOffset) > w ? (pointX - pointOffset - pop_w) : (pointX + pointOffset)
        const y = (pointY + pop_h + edgeOffset) > h ? (h - pop_h - edgeOffset) : pointY
        setPosition({ x, y })
    }


    useLayoutEffect(() => {
        if (ref.current) {
            updatePosition(ref.current.offsetHeight);
        }
    }, []);

    return (
        <div ref={ref} className='fixed pointer-events-none bg-white bg-opacity-75 rounded shadow-md p-2 z-50' style={{
            left: position.x,
            top: position.y,
            width: `${pop_w}px`
        }}>
            <div className='font-bold'>{properties.asset_label}</div>
            <div>{properties.asset_disposition_label}</div>
        </div>
    )



}


const HoverViewWrapper = ({ hoverItem }: { hoverItem?: ILayerQueryEvent }): ReactElement => {
    const properties = hoverItem?.data?.feature?.properties ?? undefined
    const point = hoverItem?.data?.windowPoint ?? undefined


    return (
        properties !== undefined && point !== undefined ? (
            <HoverView
                properties={properties as IWebCOOSMapAsset}
                point={point}
            />
        ) : <></>
    )
}

const SelectView = ({
    properties
}: { properties: IWebCOOSMapAsset }) => {

    return <CameraDetail
        slug={properties.asset_slug}
        View={({
            detail,
            summary,
            stillImageService,
            isLive
        }): ReactElement => {
            return (<>
                <div className='flex flex-col gap-4'>
                    <div className='h-[225px]'>
                        {
                            isLive && stillImageService !== null
                                ? <LatestImage
                                    service={stillImageService}
                                    assetLabel={detail.label}
                                />
                                : <img src={detail.thumbnail} alt={detail.label} className="w-full h-auto" />
                        }
                    </div>
                    <div className='p-4 flex flex-col gap-4'>
                        <h2 className='text-xl font-bold'>{detail.label}</h2>
                        <div>
                            <Link to={`/cameras/${summary.asset_slug}`} className={
                                utils.createButtonClass({
                                    size: 'md',
                                    className: 'bg-primary hover:bg-primary-dark text-white inline-block'
                                })

                            }>
                                View Full Details Page
                            </Link>
                        </div>
                    </div>
                </div>

            </>
            )
        }} />

}

const SelectViewWrapper = ({
    selectedItem
}: {
    selectedItem?: IWebCOOSMapAsset
}): ReactElement => {
    return (
        selectedItem !== undefined ? (
            <div className='absolute top-2 left-2 bg-white bg-opacity-75 rounded-lg shadow-md z-50 w-[400px] min-h-[300px] overflow-hidden'>
                <SelectView
                    properties={selectedItem as IWebCOOSMapAsset}
                />
            </div>
        ) : <></>
    )
}



const calcBounds = (features: GeoJSON.Feature[]) => {
    const geometries = features.map(d => d.geometry).filter(g => g !== null && g.type === 'Point' && g.coordinates !== undefined) as { type: 'Point'; coordinates: [number, number] }[]
    const lats = geometries.map(d => d.coordinates[1])
    const lons = geometries.map(d => d.coordinates[0])
    const minLat = Math.min(...lats)
    const maxLat = Math.max(...lats)
    const minLon = Math.min(...lons)
    const maxLon = Math.max(...lons)

    return {
        minLat,
        maxLat,
        minLon,
        maxLon
    }
}

const LegendViewWrapper = (): ReactElement => {
    return (
        <div className='legend absolute top-2 right-2 bg-white px-4 py-2 rounded shadow-md z-50 flex flex-row gap-4'>
            {
                legendItems.map(item => (
                    <div key={item.id} className='flex flex-row items-center gap-2 mb-1 text-sm'>
                        <p>{item.label} <span className={`w-4 h-4 -mb-[2px] rounded-2xl inline-block ml-1 shadow-2xl border-white border-2 ${item.color}`}></span></p>

                    </div>
                ))
            }
        </div>
    )
}

const LoadedMap = ({
    data,
    featureSort,
    SelectView = SelectViewWrapper,
    HoverView = HoverViewWrapper,
    LegendView = LegendViewWrapper,
    onItemSelect,
    center,
    zoom,
    selectedItemSlug,
    stylePointFn = (_asset: IWebCOOSMapAsset, defaultProps: Record<string, unknown>) => {
        return defaultProps

    },
    styleWedgeFn = (_asset: IWebCOOSMapAsset, defaultProps: Record<string, unknown>) => {
        return defaultProps
    }
}: IMapViewProps): ReactElement => {
    const makeGeojson = (): GeoJSON.Feature[] => {
        const features = data
            .filter(d => d.asset_location !== null && Array.isArray(d.asset_location?.coordinates) && d.asset_location.coordinates.length === 2)
            .map(d => {
                const legendItem = legendItems.find(item => item.filter(d))
                const defaultProps = {
                    color: legendItem?.hexColor ?? legendItem?.color,
                    stroke: '#FFF',
                    'stroke-width': 2,
                    'point-radius': 5,
                }
                return {
                    type: "Feature",
                    properties: {
                        ...stylePointFn(d, defaultProps),
                        ...d,
                        id: d.asset_slug
                    },
                    geometry: {
                        type: "Point",
                        coordinates: d.asset_location!.coordinates as [number, number]
                    }
                }
            }) as GeoJSON.Feature[]
        if (featureSort !== undefined) {
            features.sort((a, b) => featureSort(a.properties as IWebCOOSMapAsset, b.properties as IWebCOOSMapAsset))
        }
        return features

    }

    const makePolygonGeojson = (): GeoJSON.Feature[] => {
        const features = data
            .filter(d => d.asset_wedge !== null && d.asset_wedge !== undefined)
            .map(d => {
                const defaultProps = {
                    stroke: '#FFF',
                    'stroke-width': 2,
                    color: '#FFF',
                    opacity: .5,
                }
                return {
                    type: 'Feature',
                    properties: {
                        ...styleWedgeFn(d, defaultProps),
                        ...d,
                        id: `wedge-${d.asset_slug}`
                    },
                    geometry: d.asset_wedge as GeoJSON.Polygon
                }
            }) as GeoJSON.Feature[]
        if (featureSort !== undefined) {
            features.sort((a, b) => featureSort(a.properties as IWebCOOSMapAsset, b.properties as IWebCOOSMapAsset))
        }
        return features
    }

    const geoJson = makeGeojson()
    const polygonGeoJson = makePolygonGeojson()

    const [hoverItem, setHoverItem] = useState<ILayerQueryEvent | undefined>(undefined)
    const [selectedItem, setSelectItem] = useState<IWebCOOSMapAsset | undefined>(data.find(d => d.asset_slug === selectedItemSlug))
    const [map, setMap] = useState<IMap | undefined>(undefined)
    useEffect(() => {
        if (map !== undefined) {
            const coords = selectedItem?.asset_location?.coordinates
            if (map !== undefined && coords !== undefined) {
                map.setMapCenter({ lon: coords[0], lat: coords[1] })
            }
        }
    }, [map, selectedItem])
    const layers: IGeoJSONLayerProps[] =
        [
            {
                id: 'assets',
                type: 'geoJson',
                options: {
                    geoJson,
                    locationIdProperty: 'id'
                },
                label: '',
                zIndex: 10,
                isBaseLayer: false,
                onMouseOver: (e: ILayerQueryEvent) => {
                    if (e?.data?.feature?.properties !== undefined) {
                        setHoverItem(e)
                    } else {
                        console.log('out')
                        setHoverItem(undefined)
                    }
                },
                onMouseOut: () => {
                    setHoverItem(undefined)
                },
                onSelect: function (e: ILayerQueryEvent) {
                    setSelectItem(e?.data?.feature?.properties as IWebCOOSMapAsset | undefined)
                    if (onItemSelect) {
                        onItemSelect(e?.data?.feature?.properties as IWebCOOSMapAsset | undefined)
                    }


                }

            },
            {
                id: 'wedges',
                type: 'geoJson',
                options: {
                    geoJson: polygonGeoJson,
                    locationIdProperty: 'id'
                },
                label: '',
                zIndex: 0,
                isBaseLayer: false

            }
        ]
    useEffect(() => {
        if (map !== undefined) {
            const newGeojson = makeGeojson()
            const newPolygonGeojson = makePolygonGeojson()
            //map.removeLayer('assets')
            //map.removeLayer('wedges')
            const layersById = Object.fromEntries((map.layers ?? []).map(l => [l.id, l]))
            if (layersById.assets) {
                layersById.assets.implementation?.updateOptions({
                    geoJson: newGeojson
                })
            }
            if (layersById.wedges) {
                layersById.wedges.implementation?.updateOptions({
                    geoJson: newPolygonGeojson
                })
            }
            if (center) {
                map.setCenter(center)
                if (zoom) {
                    map.setZoom(zoom)
                }
            } else {
                const { minLon, maxLon, minLat, maxLat } = calcBounds(newGeojson)
                map.setBounds(
                    new LatLonBounds({
                        sw: { lat: minLat, lon: minLon },
                        ne: { lat: maxLat, lon: maxLon }
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
            }
        }
    }, [data, selectedItemSlug])
    const props: { center?: ILatLon, zoom?: number } = {}
    if (center) {
        props.center = center
    }
    if (zoom) {
        props.zoom = zoom
    }
    return <div className='relative h-full w-full'>
        <MapLoader
            Loader={<Loader className='pt-20' />}
            mapLibraryKey='maplibre'
            layers={layers}
            className='h-full'
            height='100%'
            baseLayerKey='mb_bathymetry'
            setState={setMap}
            {...props}
            onMapLoaded={(e) => {
                if (e.data?.map === undefined) return
                if (center) {
                    e.data.map.setCenter(center)
                    if (zoom) {
                        e.data.map.setZoom(zoom)
                    }
                } else {
                    const {
                        minLon, maxLon, minLat, maxLat
                    } = calcBounds(geoJson)
                    e.data.map.setBounds(
                        new LatLonBounds({
                            sw: { lat: minLat, lon: minLon },
                            ne: { lat: maxLat, lon: maxLon }
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
                }
                /* if(e?.data?.map?.layers !== undefined){
                    e.data.map.layers.forEach(l => {
                        e?.data?.map.removeLayer(l.id)
                    })
                }
                layers.forEach(l => {
                    e?.data?.map.addLayer(l)
                }) */
            }}

        />
        {
            LegendView && <LegendView />
        }
        {
            HoverView && <HoverView hoverItem={hoverItem} />
        }
        {
            SelectView && <SelectView selectedItem={selectedItem} />
        }
    </div>
}

export default LoadedMap