import { atom } from "jotai"

const defaultFilterValue: Record<string, string | null> = {}

export const filterPrefix = 'f_'
const url = new URL(window.location.href)
const allKeys = Array.from(url.searchParams.keys())
allKeys.forEach(k => {
    if(!k.startsWith(filterPrefix)) return
    const v = url.searchParams.get(k)
    if(v !== null && v !== '') {
        const r:RegExp = new RegExp(`^${filterPrefix}`)
        defaultFilterValue[k.replace(r, '')] = v
    }
})
const filterAtom = atom(defaultFilterValue)

export default filterAtom