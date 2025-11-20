import type { IWebCOOSCameraPageFiltered } from "@/services/assets/services"
import type { IWebCOOSAssetSummaryView } from "@/services/assets/types"
import { SelectInput, Tabs } from "@axdspub/axiom-ui-utilities"
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"
import { useAtom } from "jotai"
import { useState, type ReactElement } from "react"
import filterAtom from "./filterAtom"
import { IconCamera } from "@/Components/Icon"
import { useNavigate } from "react-router"

import { toZonedTime, format } from 'date-fns-tz';
import { SortedIcon } from "@/Components/SortedIcon"
import sortAtom from "./sortAtom"
import LoadedMap from "@/Components/Map/LoadedMap"


const defaultTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/New_York';
const formatInTimeZone = (date: string | number, fmt: string, tz: string) => format(toZonedTime(date, tz), fmt, { timeZone: tz });



const CameraPreviewImage = ({ rectSmall, squareSmall, assetLabel }: { rectSmall?: string; squareSmall?: string; assetLabel: string }): ReactElement => {
    const [errorLoading, setErrorLoading] = useState(!rectSmall && !squareSmall)
    return <>
      {(rectSmall || squareSmall) && (
          <img
              src={rectSmall || squareSmall}
              alt={assetLabel}
              className={`w-24 lg:w-40 rounded shadow ${errorLoading ? 'hidden' : ''}`}
              onError={(e) => {
                  // If rect_small fails, try square_small as fallback
                  const img = e.target as HTMLImageElement;
                  if (
                      img.src === rectSmall &&
                      squareSmall
                  ) {
                      img.src = squareSmall;
                  } else {
                      // If both fail, hide the image and show placeholder
                      setErrorLoading(true);
                  }
              }}
          />
      )}
      {
        errorLoading && 
          <div
            className={`w-24 h-16 lg:w-40 lg:h-24 bg-gray-100 rounded shadow flex items-center justify-center border-2 border-dashed border-gray-300`}
          >
              <div className='text-center text-gray-500 text-xs px-2'>
                  <div className='mb-1'>
                      <IconCamera size={4} extraClasses='mx-auto' paddingx={0} />
                  </div>
                  <div className='font-medium'>No Image</div>
                  <div className='text-gray-400'>Available</div>
              </div>
          </div>
      }
                
    </>
}

const CameraFilters = ({ data }: { data: IWebCOOSCameraPageFiltered }): ReactElement => {
  const [filters, setFilters] = useAtom(filterAtom)
    const filterViews = [
    {
      label:'Region',
      id: 'region-filter',
      column: 'asset_region',
      options: data.regions
    },
    {
      label:'State',
      id: 'state-filter',
      column: 'asset_state_or_territory',
      options: data.states
    },
    {
      label:'Product',
      id: 'product-filter',
      column: 'asset_service_slugs',
      options: data.products
    },
    {
      label:'Disposition',
      id: 'disposition-filter',
      column: 'asset_disposition_slug',
      options: data.dispositions
    },
    {
      label:'Status',
      id: 'status-filter',
      column: 'asset_operational_status_slug',
      options: data.statuses
    }
  ]
  return (
        <div className='flex flex-row gap-8 pt-6 pb-4 -mx-10 px-10 bg-white sticky top-11 z-10'>
        <p className='font-bold'>Filters</p>
          {
            filterViews.map(fv => {
              return (
                <div className='flex flex-row gap-2 text-sm align-middle' key={fv.id}>
                  <p className='mt-1'>{fv.label}:</p>
                  <SelectInput
                    defaultWrapperClassName="flex flex-row gap-2"
                    id={fv.id}
                    testId={fv.id}
                    options={fv.options}
                    size="xs"
                    value={filters?.[fv.column] ?? undefined}
                    onChange={v => {
                      const newFilters = {...filters}
                      if(v?.value !== '' && v?.value !== null && v?.value !== undefined) {
                        newFilters[fv.column] = v?.value as string
                      } else {
                        delete newFilters[fv.column]
                      }
                      setFilters(newFilters)
                    }}
                  />
                </div>
              )
            })
          }

        {
          Object.values(filters).filter(f => f !== null).length > 0 &&
          <span className='cursor-pointer -mt-1 text-2xl font-bold text-red-500 hover:text-red-700' onClick={() => {
            setFilters({})
            const url = new URL(window.location.href)
            url.searchParams.delete('filters')

          }}>
            &times;
          </span>
        }
          

      </div>
  )


}



const CameraTable = ({ data }: { data: IWebCOOSCameraPageFiltered }): ReactElement => {

  const navigate = useNavigate()
  const [sorts, setSorts] = useAtom(sortAtom)
  const columnHelper = createColumnHelper<IWebCOOSAssetSummaryView>()
  const getNextSortOb = (id: string): { column: string; dir: 'asc' | 'desc' } | null => {
    const existingDir = sorts.find(s => s.column === id)?.dir ?? 'desc'
    return  {
      column: id,
      dir: existingDir === 'desc' ? 'asc' : 'desc'
    }
  }
  const columns = [
    columnHelper.accessor('asset_thumbnails', {
        header: '',
        size: 150,
        minSize: 150,
        maxSize: 150,
        enableSorting: false,
        cell: info => {
            const row = info.row.original
            const rectSmall = row?.asset_thumbnails?.rect_small
            const squareSmall = row?.asset_thumbnails?.square_small
            return <>
                <CameraPreviewImage rectSmall={rectSmall} squareSmall={squareSmall} assetLabel={row.asset_label} />
            </>
        }
    }),
    columnHelper.accessor('asset_label', {
        header: () => {
            return <p onClick={() => {
              const nextSort = getNextSortOb('asset_label')
              if(nextSort === null) {
                setSorts(sorts.filter(sc => sc.column !== 'asset_label'))
                return
              }
              const newSorts = sorts.filter(sc => sc.column !== 'asset_label')
              newSorts.push(nextSort)
              setSorts(newSorts)
            }}>Camera</p>
        },
        size: 200,
        maxSize: 250,
        enableSorting: true,
        cell: info => {

            return <>
                <p>{info.getValue()}</p>
            </>
        }
    }),
    
    columnHelper.accessor('asset_region', {
        header: 'Region',
        enableSorting: true,
        cell: info => {
            const row = info.row.original
            return <>
              <p>{row.asset_region ?? 'NA'}</p>

            </>
        }
    }),
    columnHelper.accessor('asset_state_or_territory', {
        header: 'State',
        enableSorting: true,
        cell: info => {
            const row = info.row.original
            return <>
              <p>{row.asset_state_or_territory ?? 'NA'}</p>

            </>
        }
    }),
    /* columnHelper.accessor('asset_slug', {
        header: 'Data Access Slug',
        enableSorting: true,
        cell: info => <div className='hover:border-red-200 hover:border-2 h-full' onClick={(e)=>{
          e.preventDefault()
          e.stopPropagation()
          
        }}>
          {info.getValue()}
        </div>
    }), */
    columnHelper.accessor('asset_service_slugs', {
        header: 'Products',
        enableSorting: false,
        cell: info => Object.keys(
                Object.fromEntries(
                    info.getValue().map((slug) => {
                        if (slug.includes('rip') || slug.includes('current')) return 'rips';
                        if (slug.includes('shoreline') || slug.includes('shore')) return 'shoreline';
                        if (slug.includes('beach') || slug.includes('usage') || slug.includes('object')) return 'beach';
                        if (slug.includes('flood') || slug.includes('water')) return 'flood';
                        return null;
                    })
                    .filter((p) => p)
                    .map(p => [p,p])        
                )
            )
            .map(slug => <p key={slug}>{slug}</p>)
    }),
    columnHelper.accessor('asset_disposition_slug', {
        header: 'Disposition',
        enableSorting: true,
        cell: info => <p>{info.getValue()}</p>,
    }),
    columnHelper.accessor('asset_operational_status_label', {
        header: 'Status',
        enableSorting: true,
        cell: info => <p>{info.getValue()}</p>
    }),
    columnHelper.accessor('asset_first_starting', {
        header: 'Starting',
        minSize: 150,
        enableSorting: true,
        cell: info => {
          return <p>{
            formatInTimeZone(
                info.row.original.asset_first_starting,
                'yyyy-MM-dd',
                info.row.original.asset_timezone  ?? defaultTimeZone
            )
          }</p>
        }
    }),
    columnHelper.accessor('asset_last_ending', {
        header: 'Ending',
        enableSorting: true,
        cell: info => {
          const date = new Date(info.row.original.asset_last_ending)
          return <p>{
            formatInTimeZone(
                Number(date),
                'yyyy-MM-dd',
                info.row.original.asset_timezone  ?? defaultTimeZone
            )
          }</p>
        }
    }),
  ]
  const table = useReactTable({
    data: data.assets,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })



  const sortsMap = Object.fromEntries(sorts.map(s => [s.column, s]))
  console.log('rows', table.getRowModel().rows)

  return (
    <div className='flex flex-col'>

      <table className='-mx-10'>
        <thead className='sticky top-35 bg-white shadow-md z-10'>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => {
                const isSortable = header.column.columnDef.enableSorting === true
                const isSortedOn = isSortable && sortsMap[header.id] !== undefined
                return (
                  <th key={header.id} className={`p-4 text-left text-sm first:pl-10 last:pr-10 ${isSortable ? `cursor-pointer text-slate-600 hover:text-slate-800${isSortedOn ? ' bg-slate-100' : ' hover:bg-slate-100'}` : 'text-slate-400'}`} style={{width: header.getSize()}} onClick={isSortable ? () => {
                    const nextSort = getNextSortOb(header.column.id)
                    if(nextSort === null) {
                      setSorts(sorts.filter(sc => sc.column !== header.column.id))
                      return
                    }
                    setSorts([nextSort])
                  } : undefined}>
                    <div className='flex flex-row gap-1 justify-between items-center'>
                    {header.isPlaceholder 
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    {
                      isSortable
                        ? <SortedIcon activeColor='#333' direction={sortsMap[header.id] === undefined ? 'none' : sortsMap[header.id].dir === 'desc' ? 'desc' : 'asc'} />
                        : ''
                    }
                    </div>
                  </th>
                )
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr 
                key={row.id} 
                className='odd:bg-slate-100 even:bg-white hover:bg-slate-50 cursor-pointer' 
                data-asset-slug={row.original.asset_slug}
                onClick={(e) => {
                    const target = e.target as HTMLElement
                    if(target.tagName !== 'A' && !target.closest('a')) {
                        const url = `/cameras/${row.original.asset_slug}`
                        navigate(url)
                    }
                }}
                
            >
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} className='p-4 align-top first:pl-10 last:pr-10 text-sm border-r-2 border-slate-200 last:border-0 first:border-0'>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const CamerasView = ({ data }: { data: IWebCOOSCameraPageFiltered }): ReactElement => {
    return (
        <div className='flex flex-col h-full'>
            <CameraFilters data={data} />
            <Tabs
                className='relative h-full'
                navClassName="-mx-10 px-4 sticky top-24 bg-white z-10"
                tabNavClassName="cursor-pointer hover:bg-slate-100"
                onChange={(id) => {
                  const url = new URL(window.location.href)
                  url.searchParams.set('tab', id)
                  window.history.pushState({}, '', url.toString())
                }}
                selectedTab={new URL(window.location.href).searchParams.get('tab') ?? undefined}
                tabs={
                    [
                        {
                            id: 'table',
                            label: 'Table View',
                            content: <CameraTable data={data} />
                        },
                        {
                            id: 'map',
                            label: 'Map View',
                            className: 'h-[800px] sticky top-35',
                            content: <LoadedMap data={data.assets} />
                        }
                    ]
                }
            />

        </div>
    )
}

export default CamerasView