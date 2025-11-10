export type Role = 'Tank' | 'Fighter' | 'Assassin' | 'Mage' | 'Marksman' | 'Support'
export type Lane = 'Gold' | 'EXP' | 'Mid' | 'Jungle' | 'Roam'

export interface HeroSummary {
  id: string
  name: string
  title: string
  portrait: string
  roles: Role[]
  lanes: Lane[]
}

export interface AbilityBuild {
  priority: string[]
  description?: string
}

export interface ItemBuild {
  name: string
  description?: string
  icon: string
}

export interface EmblemSetup {
  name: string
  configuration: string
}

export interface SpellSetup {
  name: string
  description?: string
}

export interface HeroBuild {
  id: string
  name: string
  description?: string
  items: ItemBuild[]
  emblem: EmblemSetup
  spell: SpellSetup
  ability: AbilityBuild
  isMeta: boolean
}

export interface TierListEntry {
  hero: HeroSummary
  rating: 'S' | 'A' | 'B' | 'C'
  role: Role
  lane: Lane
  notes?: string
}

export interface TierListResponse {
  updatedAt: string
  entries: TierListEntry[]
}

export interface HeroDetail extends HeroSummary {
  lore: string
  strengths: string[]
  weaknesses: string[]
  recommendedBuilds: HeroBuild[]
  offMetaBuilds: HeroBuild[]
}

export interface OffMetaBuildResponse {
  filters: {
    role?: Role
    lane?: Lane
  }
  builds: HeroBuild[]
}

export interface ApiError {
  status: number
  message: string
  details?: string
}
