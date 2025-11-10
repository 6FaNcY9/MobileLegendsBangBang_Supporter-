import styles from './StatusState.module.css'

interface ErrorStateProps {
  message?: string
  onRetry?: () => void
}

export const ErrorState = ({ message = 'Something went wrong.', onRetry }: ErrorStateProps) => (
  <div role="alert" className={styles.state}>
    <span className={styles.errorIcon} aria-hidden>!</span>
    <p>{message}</p>
    {onRetry && (
      <button type="button" onClick={onRetry} className={styles.retry}>
        Retry
      </button>
    )}
  </div>
)

export default ErrorState
