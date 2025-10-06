import { atom } from "jotai"

const defaultFilterValue: Record<string, string | null> = {}

const url = new URL(window.location.href)
const allKeys = Array.from(url.searchParams.keys())
allKeys.forEach(k => {
    const v = url.searchParams.get(k)
    if(v !== null && v !== '') {
        defaultFilterValue[k] = v
    }
})
const filterAtom = atom(defaultFilterValue)

export default filterAtom