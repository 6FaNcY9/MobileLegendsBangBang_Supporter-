import { Link } from 'react-router-dom'
import styles from './HomePage.module.css'

export const HomePage = () => (
  <div className={styles.hero}>
    <header>
      <h1>Stay ahead of the Land of Dawn meta</h1>
      <p>
        Track tier lists, explore curated builds, and surface inventive off-meta strategies
        designed for coordinated teams and solo queue dreamers alike.
      </p>
    </header>

    <section className={styles.actions}>
      <Link to="/tier-lists" className={styles.primaryAction}>
        View current tier lists
      </Link>
      <Link to="/off-meta" className={styles.secondaryAction}>
        Experiment with off-meta builds
      </Link>
    </section>

    <section className={styles.features} aria-label="Feature summary">
      <article>
        <h2>Role-aware tier insights</h2>
        <p>Filter by lane or role to instantly see who dominates each rotation.</p>
      </article>
      <article>
        <h2>Pro inspired UI</h2>
        <p>Our Pro Setup styling mirrors the in-game experience for quick recall.</p>
      </article>
      <article>
        <h2>Mobile ready</h2>
        <p>Responsive layout and accessible controls support your squad anywhere.</p>
      </article>
    </section>
  </div>
)

export default HomePage
