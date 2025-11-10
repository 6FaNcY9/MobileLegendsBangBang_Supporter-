import { useMemo } from 'react'
import { useTierLists } from '../../api/hooks'
import { FilterToolbar } from '../../components/ui/FilterToolbar'
import { ErrorState } from '../../components/ui/ErrorState'
import { LoadingState } from '../../components/ui/LoadingState'
import { HeroPortrait } from '../../components/ui/HeroPortrait'
import useFilters from '../../hooks/useFilters'
import styles from './TierListsPage.module.css'

export const TierListsPage = () => {
  const { role, lane, filters, setRole, setLane, resetFilters } = useFilters()
  const { data, isLoading, isError, refetch } = useTierLists(role, lane)

  const grouped = useMemo(() => {
    if (!data) return {}
    return data.entries.reduce<Record<string, typeof data.entries>>((acc, entry) => {
      acc[entry.rating] ??= []
      acc[entry.rating].push(entry)
      return acc
    }, {})
  }, [data])

  if (isLoading) return <LoadingState message="Fetching tier rankings…" />
  if (isError) return <ErrorState onRetry={() => refetch()} />
  if (!data) return null

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>Tier Lists</h1>
        <p>Discover the strongest heroes per role and lane each patch cycle.</p>
        <p className={styles.updatedAt}>Updated {new Date(data.updatedAt).toLocaleString()}</p>
      </header>

      <FilterToolbar role={filters.role} lane={filters.lane} onRoleChange={setRole} onLaneChange={setLane} onReset={resetFilters} />

      <div className={styles.tiers}>
        {['S', 'A', 'B', 'C'].map((tier) => {
          const entries = grouped[tier] ?? []
          if (!entries.length) return null

          return (
            <section key={tier} aria-label={`${tier} tier`} className={styles.tierSection}>
              <h2>{tier} Tier</h2>
              <div className={styles.heroGrid}>
                {entries.map((entry) => (
                  <div key={entry.hero.id} className={styles.heroCard}>
                    <HeroPortrait hero={entry.hero} />
                    {entry.notes && <p className={styles.notes}>{entry.notes}</p>}
                  </div>
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}

export default TierListsPage
