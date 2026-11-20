import styles from './DecideButton.module.css'

interface Props {
  hasResult: boolean
  disabled: boolean
  onClick: () => void
}

export function DecideButton({ hasResult, disabled, onClick }: Props) {
  return (
    <button type="button" className={styles.button} disabled={disabled} onClick={onClick}>
      {hasResult ? 'Again' : 'Decide'}
    </button>
  )
}
