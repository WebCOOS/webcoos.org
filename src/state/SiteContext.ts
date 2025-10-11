import { createContext } from 'react'
import type { SiteConfig } from '@/types/yaml/site'
const SiteContext = createContext<SiteConfig | undefined>(undefined)
export default SiteContext