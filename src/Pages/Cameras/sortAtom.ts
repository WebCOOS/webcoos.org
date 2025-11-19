import { atom } from "jotai"



export const sortPrefix = 's_'
const url = new URL(window.location.href)
const allKeys = Array.from(url.searchParams.keys()).filter(k => k.startsWith(sortPrefix))
const defaultSortValue: Array<{column: string, dir: 'asc' | 'desc'}> = allKeys.length ? [] : [
    { column: 'asset_last_ending', dir: 'desc' },
    { column: 'asset_label', dir: 'asc' }
]

allKeys.forEach(k => {
    const v = url.searchParams.get(k)
    if(v !== null && v !== '') {
        const r:RegExp = new RegExp(`^${sortPrefix}`)
        defaultSortValue.push({ column: k.replace(r, ''), dir: v === 'true' ? 'asc' : 'desc' })
    }
})
const sortAtom = atom(defaultSortValue)


export default sortAtom