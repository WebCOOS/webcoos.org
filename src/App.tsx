
import './App.css'
import { BrowserRouter,  Route, Routes, useParams } from "react-router"
import Home from './Pages/Home'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import YAML from './Layouts/YAML'
import type { SiteConfig } from '@/types/yaml/site'
import SiteContext from './state/SiteContext'
import Header from './Components/Header/Header'
import Markdown from './Layouts/Markdown'
import Footer from './Components/Footer/Footer'
import type { ReactElement } from 'react'
import About from './Pages/About/About'
import Feedback from './Pages/Feedback'
import ApiContext from '@/state/ApiContext'
import apiContextDefault from '@/state/apiContextDefault'
import CamerasLoader from '@/Pages/Cameras/Cameras'
import CamerasNew from './Pages/Cameras/CamerasNew'
import CameraDetail from './Pages/CameraDetail/CameraDetail'
import PageTitle from './Components/PageTitle'
import Demo from './Demo/Demo'


const queryClient = new QueryClient()

const ProductDetail = (): ReactElement => {
  const { productId } = useParams();
  return <>
    <PageTitle>Products | WebCOOS</PageTitle>
    <Markdown markdownFile={`/md_content/products/${productId}.md`} />
  </>
}

const CameraDetailWrapper = (): ReactElement => {
    const { slug } = useParams();
    return <CameraDetail slug={slug!} />
}

function App(site: SiteConfig) {
  return (
    <div className='min-h-screen flex flex-col pt-[100px]'>
    <SiteContext value={site}>
        <BrowserRouter>
        <Header />
        <div className='h-full flex-grow relative'>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/get-involved" element={<Markdown markdownFile="/md_content/get-involved.md" />} />
            <Route path="/about" element={<About />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/products" element={
              <>
                <PageTitle>Products | WebCOOS</PageTitle>
                <Markdown markdownFile="/md_content/products.md" />
              </>
            } />
            <Route path="/products/:productId" element={<ProductDetail />} />
            <Route path="/cameras" element={<CamerasLoader />} />
            <Route path="/cameras-new" element={<CamerasNew />} />
            <Route path="/cameras/:slug" element={<CameraDetailWrapper />} />
            <Route path="/demo" element={<Demo />} />
            <Route path="/demo/:groupId/:itemId" element={<Demo />} />
          </Routes>
          </div>
          <Footer />
        </BrowserRouter>
    </SiteContext>
    </div>
  )
}

function AppPreload() {
  return <ApiContext value={apiContextDefault}>
            <QueryClientProvider client={queryClient}> 
              <YAML<SiteConfig>
                        yamlFile="/yaml_content/site.yaml" 
                        Component={App} 
                        />
          </QueryClientProvider>
      </ApiContext>
}

export default AppPreload
