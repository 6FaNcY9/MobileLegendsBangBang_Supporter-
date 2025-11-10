import { useMemo } from 'react'
import { useOffMetaBuilds } from '../../api/hooks'
import { BuildCard } from '../../components/ui/BuildCard'
import { ErrorState } from '../../components/ui/ErrorState'
import { FilterToolbar } from '../../components/ui/FilterToolbar'
import { LoadingState } from '../../components/ui/LoadingState'
import useFilters from '../../hooks/useFilters'
import styles from './OffMetaPage.module.css'

export const OffMetaPage = () => {
  const { filters, setRole, setLane, resetFilters } = useFilters()
  const { data, isLoading, isError, refetch } = useOffMetaBuilds(filters)

  const builds = useMemo(() => data?.builds ?? [], [data])

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>Off-Meta Explorer</h1>
        <p>Find spicy builds for scrims and ranked sessions. Filter by lane, role, and team needs.</p>
      </header>

      <FilterToolbar role={filters.role} lane={filters.lane} onRoleChange={setRole} onLaneChange={setLane} onReset={resetFilters} />

      {isLoading && <LoadingState message="Gathering inventive builds…" />}
      {isError && <ErrorState onRetry={() => refetch()} />}

      {builds.length > 0 ? (
        <div className={styles.grid}>
          {builds.map((build) => (
            <BuildCard key={build.id} build={build} heroName={build.name} />
          ))}
        </div>
      ) : (
        !isLoading && !isError && (
          <p className={styles.empty}>No off-meta builds match those filters yet.</p>
        )
      )}
    </div>
  )
}

export default OffMetaPage
