import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useHeroes } from '../../api/hooks'
import { FilterToolbar } from '../../components/ui/FilterToolbar'
import { ErrorState } from '../../components/ui/ErrorState'
import { HeroPortrait } from '../../components/ui/HeroPortrait'
import { LoadingState } from '../../components/ui/LoadingState'
import useFilters from '../../hooks/useFilters'
import styles from './HeroRosterPage.module.css'

export const HeroRosterPage = () => {
  const navigate = useNavigate()
  const { role, lane, filters, setRole, setLane, resetFilters } = useFilters()
  const [search, setSearch] = useState('')

  const { data: heroes, isLoading, isError, refetch } = useHeroes({
    search: search || undefined,
    role,
    lane,
  })

  const handleHeroSelect = (heroId: string) => navigate(`/heroes/${heroId}`)

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>Hero Roster</h1>
        <p>Search and filter the full roster to lock in the perfect counter or flex pick.</p>
      </header>

      <FilterToolbar
        search={search}
        onSearchChange={setSearch}
        role={filters.role}
        lane={filters.lane}
        onRoleChange={setRole}
        onLaneChange={setLane}
        onReset={() => {
          setSearch('')
          resetFilters()
        }}
        searchPlaceholder="Search by hero or title"
      />

      {isLoading && <LoadingState message="Loading heroes…" />}
      {isError && <ErrorState onRetry={() => refetch()} />}

      {heroes && (
        <section aria-live="polite">
          <p className={styles.count}>
            Showing <strong>{heroes.length}</strong> hero{heroes.length === 1 ? '' : 'es'}
          </p>
          <div className={styles.grid}>
            {heroes.map((hero) => (
              <HeroPortrait key={hero.id} hero={hero} onSelect={handleHeroSelect} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

export default HeroRosterPage
