import { Link, NavLink } from 'react-router-dom'
import classes from 'classnames'
import styles from './AppHeader.module.css'

const navigation = [
  { to: '/', label: 'Home' },
  { to: '/tier-lists', label: 'Tier Lists' },
  { to: '/heroes', label: 'Hero Roster' },
  { to: '/off-meta', label: 'Off-Meta Explorer' },
]

export const AppHeader = () => (
  <header className={styles.header}>
    <div className={styles.branding}>
      <Link to="/" className={styles.logo}>
        MLBB Supporter
      </Link>
      <span className={styles.tagline}>Live meta insights & experimental builds</span>
    </div>
    <nav aria-label="Primary" className={styles.nav}>
      <ul>
        {navigation.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                classes(styles.navLink, {
                  [styles.active]: isActive,
                })
              }
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  </header>
)

export default AppHeader
