import { Outlet } from 'react-router-dom'
import { AppHeader } from './AppHeader'
import styles from './AppLayout.module.css'

export const AppLayout = () => (
  <div className={styles.shell}>
    <AppHeader />
    <main className={styles.main}>
      <Outlet />
    </main>
    <footer className={styles.footer}>
      <p>
        Data refreshed hourly from the MLBB Supporter API. Feedback? Join the community
        Discord.
      </p>
    </footer>
  </div>
)

export default AppLayout
