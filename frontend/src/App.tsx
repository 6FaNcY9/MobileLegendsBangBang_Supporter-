import { Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import HomePage from './pages/home/HomePage'
import TierListsPage from './pages/tier-lists/TierListsPage'
import HeroRosterPage from './pages/hero-roster/HeroRosterPage'
import HeroDetailPage from './pages/hero-detail/HeroDetailPage'
import OffMetaPage from './pages/off-meta/OffMetaPage'

const App = () => (
  <Routes>
    <Route path="/" element={<AppLayout />}>
      <Route index element={<HomePage />} />
      <Route path="tier-lists" element={<TierListsPage />} />
      <Route path="heroes" element={<HeroRosterPage />} />
      <Route path="heroes/:heroId" element={<HeroDetailPage />} />
      <Route path="off-meta" element={<OffMetaPage />} />
    </Route>
  </Routes>
)

export default App
