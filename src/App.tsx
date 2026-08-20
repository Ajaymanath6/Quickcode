import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import CatalogLayout from '@/layouts/CatalogLayout'
import MainLayout from '@/layouts/MainLayout'
import ThemeConfigurationLayout from '@/layouts/ThemeConfigurationLayout'
import AdminCanvasOutlet from '@/pages/AdminCanvasOutlet'
import LandingPage from '@/pages/LandingPage'
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
        <Route element={<MainLayout />}>
          <Route path="/" element={<LandingPage />} />
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
