import type { IWebCOOSCameraPageFiltered } from "@/services/assets/services"
import type { IWebCOOSAssetSummaryView } from "@/services/assets/types"
import { SelectInput } from "@axdspub/axiom-ui-utilities"
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"
import { useAtom } from "jotai"
import type { ReactElement } from "react"
import filterAtom from "./filterAtom"

const CameraTable = ({ data }: { data: IWebCOOSCameraPageFiltered }): ReactElement => {

  const [filters, setFilters] = useAtom(filterAtom)
  const columnHelper = createColumnHelper<IWebCOOSAssetSummaryView>()
  const columns = [
    columnHelper.accessor('asset_label', {
        header: 'Camera',
        cell: info => {
            return <>

                {/* <img
                    src={`${apiContext.apiUrl}/webcoos/api/v1/services/${info.row.original.asset_slug}/elements/latest/redirect/`}
                    alt={info.getValue()}
                    className='w-24 lg:w-40 rounded shadow'
                    
                /> */}

                <p>{info.getValue()}</p>
            </>
        }
    }),
    columnHelper.accessor('asset_region', {
        header: 'Geography',
        cell: info => {
            const row = info.row.original
            return <>
              {row.asset_region && <p className="font-bold">{row.asset_region}</p>}
              {row.asset_state_or_territory && <p>{row.asset_state_or_territory}</p>}

            </>
        }
    }),
    columnHelper.accessor('asset_slug', {
        header: 'Data Access Slug',
        cell: info => <p>{info.getValue()}</p>
    }),
    columnHelper.accessor('asset_service_slugs', {
        header: 'Products',
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
        cell: info => <p>{info.getValue()}</p>,
    }),
    columnHelper.accessor('asset_operational_status', {
        header: 'Status',
        cell: info => <p>{info.getValue()}</p>
    }),
    columnHelper.accessor('asset_first_starting', {
        header: 'Starting',
        cell: info => <p>{info.getValue()}</p>
    }),
    columnHelper.accessor('asset_last_ending', {
        header: 'Ending',
        cell: info => <p>{info.getValue()}</p>
    }),
  ]
  const table = useReactTable({
    data: data.assets,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

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
      column: 'asset_operational_status',
      options: data.statuses
    }
  ]

  return (
    <div className='flex flex-col'>
      <div className='flex flex-row gap-8 pt-6 pb-4 -mx-10 px-10 bg-white sticky top-10'>
        <p className='font-bold'>Filters</p>
          {
            filterViews.map(fv => {
              return (
                <div className='flex flex-row gap-2' key={fv.id}>
                  <p className=''>{fv.label}:</p>
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
          

      </div>
      <table className='-mx-10'>
        <thead className='sticky top-24 bg-white shadow-md z-10'>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id} className="p-4 text-left first:pl-10 last:pr-10">
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id} className='odd:bg-slate-100 even:bg-white'>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} className='p-4 align-top first:pl-10 last:pr-10 text-sm border-r-2 border-slate-200 last:border-0'>
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

export default CameraTable