import type { ChangeEvent } from 'react'
import type { Lane, Role } from '../../api/types'
import styles from './FilterToolbar.module.css'

interface FilterToolbarProps {
  search?: string
  role?: Role
  lane?: Lane
  onSearchChange?: (value: string) => void
  onRoleChange?: (value?: Role) => void
  onLaneChange?: (value?: Lane) => void
  onReset?: () => void
  searchPlaceholder?: string
}

const roleOptions: Role[] = ['Tank', 'Fighter', 'Assassin', 'Mage', 'Marksman', 'Support']
const laneOptions: Lane[] = ['Gold', 'EXP', 'Mid', 'Jungle', 'Roam']

export const FilterToolbar = ({
  search,
  role,
  lane,
  onSearchChange,
  onRoleChange,
  onLaneChange,
  onReset,
  searchPlaceholder = 'Search heroes…',
}: FilterToolbarProps) => {
  const handleSelectChange = <T extends Role | Lane | undefined>(
    handler?: (value?: T) => void
  ) =>
    (event: ChangeEvent<HTMLSelectElement>) => {
      if (!handler) return
      const value = event.target.value
      handler(value ? (value as T) : undefined)
    }

  return (
    <section className={styles.toolbar} aria-label="Filters">
      {onSearchChange && (
        <label className={styles.field}>
          <span className={styles.label}>Search</span>
          <input
            type="search"
            value={search ?? ''}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder={searchPlaceholder}
            className={styles.search}
          />
        </label>
      )}

      <label className={styles.field}>
        <span className={styles.label}>Role</span>
        <select value={role ?? ''} onChange={handleSelectChange<Role>(onRoleChange)}>
          <option value="">All</option>
          {roleOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>

      <label className={styles.field}>
        <span className={styles.label}>Lane</span>
        <select value={lane ?? ''} onChange={handleSelectChange<Lane>(onLaneChange)}>
          <option value="">All</option>
          {laneOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>

      {onReset && (
        <button type="button" onClick={onReset} className={styles.reset}>
          Reset
        </button>
      )}
    </section>
  )
}

export default FilterToolbar
