import { useQuery } from '@tanstack/react-query'
import type { UseQueryOptions } from '@tanstack/react-query'
import apiClient from './client'
import type {
  HeroDetail,
  HeroSummary,
  OffMetaBuildResponse,
  Role,
  Lane,
  TierListResponse,
} from './types'

export const queryKeys = {
  tierLists: (role?: Role, lane?: Lane) => ['tier-lists', role, lane] as const,
  heroes: (params: HeroQueryParams) => ['heroes', params] as const,
  hero: (id: string) => ['hero', id] as const,
  offMeta: (params: OffMetaQueryParams) => ['off-meta', params] as const,
}

export interface HeroQueryParams {
  search?: string
  role?: Role
  lane?: Lane
}

export interface OffMetaQueryParams {
  role?: Role
  lane?: Lane
}

export const useTierLists = (role?: Role, lane?: Lane, options?: UseQueryOptions<TierListResponse>) =>
  useQuery({
    queryKey: queryKeys.tierLists(role, lane),
    queryFn: async () => {
      const response = await apiClient.get<TierListResponse>('/tier-lists', {
        params: { role, lane },
      })
      return response.data
    },
    staleTime: 60_000,
    ...options,
  })

export const useHeroes = (params: HeroQueryParams, options?: UseQueryOptions<HeroSummary[]>) =>
  useQuery({
    queryKey: queryKeys.heroes(params),
    queryFn: async () => {
      const response = await apiClient.get<HeroSummary[]>('/heroes', {
        params,
      })
      return response.data
    },
    staleTime: 60_000,
    ...options,
  })

export const useHeroDetail = (
  heroId: string,
  options?: UseQueryOptions<HeroDetail | null>
) =>
  useQuery({
    queryKey: queryKeys.hero(heroId),
    queryFn: async () => {
      if (!heroId) return null
      const response = await apiClient.get<HeroDetail>(`/heroes/${heroId}`)
      return response.data
    },
    enabled: Boolean(heroId),
    staleTime: 120_000,
    ...options,
  })

export const useOffMetaBuilds = (
  params: OffMetaQueryParams,
  options?: UseQueryOptions<OffMetaBuildResponse>
) =>
  useQuery({
    queryKey: queryKeys.offMeta(params),
    queryFn: async () => {
      const response = await apiClient.get<OffMetaBuildResponse>('/off-meta-builds', {
        params,
      })
      return response.data
    },
    staleTime: 60_000,
    ...options,
  })
