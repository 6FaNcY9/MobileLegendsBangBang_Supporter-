import type { HeroSummary } from '../../api/types'
import styles from './HeroPortrait.module.css'

interface HeroPortraitProps {
  hero: HeroSummary
  onSelect?: (heroId: string) => void
}

export const HeroPortrait = ({ hero, onSelect }: HeroPortraitProps) => (
  <button
    type="button"
    className={styles.tile}
    onClick={() => onSelect?.(hero.id)}
    aria-label={`${hero.name}, ${hero.roles.join(', ')}`}
  >
    <div className={styles.imageWrapper}>
      <img src={hero.portrait} alt="" />
    </div>
    <div className={styles.meta}>
      <h3>{hero.name}</h3>
      <p>{hero.title}</p>
      <div className={styles.tags}>
        {hero.roles.map((role) => (
          <span key={role}>{role}</span>
        ))}
      </div>
    </div>
  </button>
)

export default HeroPortrait
