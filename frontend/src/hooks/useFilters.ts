import { useMemo, useState } from 'react'
import type { Lane, Role } from '../api/types'

type FilterState = {
  role?: Role
  lane?: Lane
}

export const useFilters = (initial: FilterState = {}) => {
  const [role, setRole] = useState<Role | undefined>(initial.role)
  const [lane, setLane] = useState<Lane | undefined>(initial.lane)

  const filters = useMemo(() => ({ role, lane }), [role, lane])

  const resetFilters = () => {
    setRole(undefined)
    setLane(undefined)
  }

  return {
    role,
    lane,
    filters,
    setRole,
    setLane,
    resetFilters,
  }
}

export default useFilters
