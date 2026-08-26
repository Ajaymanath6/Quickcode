import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import CatalogLayout from '@/layouts/CatalogLayout'
import MainLayout from '@/layouts/MainLayout'
import ThemeConfigurationLayout from '@/layouts/ThemeConfigurationLayout'
import AdminCanvasOutlet from '@/pages/AdminCanvasOutlet'
import LandingPage from '@/pages/landing'
import Landing1Page from '@/pages/landing1'
import Landing2Page from '@/pages/landing2'
import Landing3Page from '@/pages/landing3'
import Landing4Page from '@/pages/landing4'
import CasePage from '@/pages/case'
import LoadingPage from '@/pages/loading'
import CatalogAllPage from '@/pages/catalog/CatalogAllPage'
import CatalogBookmarksPage from '@/pages/catalog/CatalogBookmarksPage'
import CatalogHomePage from '@/pages/catalog/CatalogHomePage'
import CatalogLayoutsPage from '@/pages/catalog/CatalogLayoutsPage'
import ThemeColorsPanel from '@/pages/theme/ThemeColorsPanel'
import ThemeShadowsPanel from '@/pages/theme/ThemeShadowsPanel'
import ThemeSpacingPanel from '@/pages/theme/ThemeSpacingPanel'
import ThemeTypographyPanel from '@/pages/theme/ThemeTypographyPanel'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/landing" replace />} />
        <Route path="/loading" element={<LoadingPage />} />
        <Route path="/case" element={<CasePage />} />
        <Route element={<MainLayout />}>
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/landing1" element={<Landing1Page />} />
          <Route path="/landing2" element={<Landing2Page />} />
          <Route path="/landing3" element={<Landing3Page />} />
          <Route path="/landing4" element={<Landing4Page />} />
        </Route>
        <Route path="/admin" element={<Navigate to="/admin/canvas" replace />} />
        <Route path="/catalog" element={<Navigate to="/catalog/home" replace />} />
        <Route element={<CatalogLayout />}>
          <Route path="/catalog/home" element={<CatalogHomePage />} />
          <Route path="/catalog/all" element={<CatalogAllPage />} />
          <Route path="/catalog/bookmarks" element={<CatalogBookmarksPage />} />
          <Route path="/catalog/layouts" element={<CatalogLayoutsPage />} />
          <Route path="/catalog/theme" element={<ThemeConfigurationLayout />}>
            <Route index element={<Navigate to="colors" replace />} />
            <Route path="colors" element={<ThemeColorsPanel />} />
            <Route path="typography" element={<ThemeTypographyPanel />} />
            <Route path="shadows" element={<ThemeShadowsPanel />} />
            <Route path="spacing" element={<ThemeSpacingPanel />} />
          </Route>
          <Route path="/admin/canvas" element={<AdminCanvasOutlet />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
