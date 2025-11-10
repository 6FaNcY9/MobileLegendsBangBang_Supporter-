import { useState } from 'react'
import copy from 'copy-to-clipboard'
import type { HeroBuild } from '../../api/types'
import styles from './BuildCard.module.css'

interface BuildCardProps {
  build: HeroBuild
  heroName?: string
}

export const BuildCard = ({ build, heroName }: BuildCardProps) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    const text = [
      `${heroName ?? ''} - ${build.name}`,
      '',
      `Items: ${build.items.map((item) => item.name).join(', ')}`,
      `Emblem: ${build.emblem.name} (${build.emblem.configuration})`,
      `Spell: ${build.spell.name}`,
      `Ability priority: ${build.ability.priority.join(' > ')}`,
      build.description ? `Notes: ${build.description}` : undefined,
    ]
      .filter(Boolean)
      .join('\n')

    copy(text)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2_000)
  }

  return (
    <article className={styles.card} aria-label={`${build.name} build`}>
      <header className={styles.header}>
        <div>
          <span className={styles.metaBadge}>{build.isMeta ? 'Meta' : 'Off-Meta'}</span>
          <h3>{build.name}</h3>
          {build.description && <p className={styles.description}>{build.description}</p>}
        </div>
        <button type="button" onClick={handleCopy} className={styles.copyButton}>
          {copied ? 'Copied!' : 'Copy Build'}
        </button>
      </header>

      <section className={styles.section} aria-label="Item build">
        <h4>Items</h4>
        <ul>
          {build.items.map((item) => (
            <li key={item.name}>
              <div className={styles.itemIcon} aria-hidden>
                <img src={item.icon} alt="" />
              </div>
              <div>
                <span className={styles.itemName}>{item.name}</span>
                {item.description && <p>{item.description}</p>}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.section} aria-label="Emblem and spell">
        <div>
          <h4>Emblem</h4>
          <p>
            <span className={styles.highlight}>{build.emblem.name}</span> — {build.emblem.configuration}
          </p>
        </div>
        <div>
          <h4>Battle Spell</h4>
          <p>
            <span className={styles.highlight}>{build.spell.name}</span>
            {build.spell.description && ` — ${build.spell.description}`}
          </p>
        </div>
      </section>

      <section className={styles.section} aria-label="Ability priority">
        <h4>Ability Priority</h4>
        <p className={styles.priority}>{build.ability.priority.join(' > ')}</p>
        {build.ability.description && <p>{build.ability.description}</p>}
      </section>
    </article>
  )
}

export default BuildCard
