import styles from './StatusState.module.css'

interface LoadingStateProps {
  message?: string
}

export const LoadingState = ({ message = 'Loading data…' }: LoadingStateProps) => (
  <div role="status" className={styles.state}>
    <span className={styles.spinner} aria-hidden />
    <p>{message}</p>
  </div>
)

export default LoadingState
