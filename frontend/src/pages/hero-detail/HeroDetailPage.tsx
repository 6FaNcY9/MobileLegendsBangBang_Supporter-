import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useHeroDetail } from '../../api/hooks'
import { BuildCard } from '../../components/ui/BuildCard'
import { ErrorState } from '../../components/ui/ErrorState'
import { LoadingState } from '../../components/ui/LoadingState'
import { TabSwitcher } from '../../components/ui/TabSwitcher'
import styles from './HeroDetailPage.module.css'

const TAB_META = 'meta'
const TAB_OFF_META = 'off-meta'

export const HeroDetailPage = () => {
  const { heroId = '' } = useParams<{ heroId: string }>()
  const [activeTab, setActiveTab] = useState<string>(TAB_META)
  const { data: hero, isLoading, isError, refetch } = useHeroDetail(heroId)

  const builds = useMemo(() => {
    if (!hero) return []
    if (activeTab === TAB_META) {
      return hero.recommendedBuilds.filter((build) => build.isMeta)
    }
    return hero.offMetaBuilds.length ? hero.offMetaBuilds : hero.recommendedBuilds.filter((build) => !build.isMeta)
  }, [hero, activeTab])

  if (isLoading) return <LoadingState message="Loading hero details…" />
  if (isError) return <ErrorState onRetry={() => refetch()} />
  if (!hero) return null

  return (
    <article className={styles.page}>
      <header className={styles.heroHeader}>
        <div className={styles.portrait}>
          <img src={hero.portrait} alt="" />
        </div>
        <div>
          <p className={styles.roleTags}>{hero.roles.join(' • ')}</p>
          <h1>{hero.name}</h1>
          <p className={styles.title}>{hero.title}</p>
          <p className={styles.lanes}>Best lanes: {hero.lanes.join(', ')}</p>
        </div>
      </header>

      <section className={styles.lore}>
        <h2>Lore</h2>
        <p>{hero.lore}</p>
      </section>

      <section className={styles.traits}>
        <div>
          <h3>Strengths</h3>
          <ul>
            {hero.strengths.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Weaknesses</h3>
          <ul>
            {hero.weaknesses.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section>
        <TabSwitcher
          tabs={[
            { id: TAB_META, label: 'Meta Builds' },
            { id: TAB_OFF_META, label: 'Off-Meta Experiments' },
          ]}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <div className={styles.builds}>
          {builds.length ? (
            builds.map((build) => <BuildCard key={build.id} build={build} heroName={hero.name} />)
          ) : (
            <p className={styles.noBuilds}>No builds available for this view yet.</p>
          )}
        </div>
      </section>
    </article>
  )
}

export default HeroDetailPage
