import { CATEGORIES, type Category } from '../../lib/types'
import styles from './CategoryPicker.module.css'

interface Props {
  selected: readonly Category[]
  onChange: (next: Category[]) => void
}

export function CategoryPicker({ selected, onChange }: Props) {
  const surprise = CATEGORIES.every((c) => selected.includes(c))

  const toggle = (c: Category) =>
    onChange(selected.includes(c) ? selected.filter((x) => x !== c) : [...selected, c])

  // Surprise me is derived: on exactly when all three are checked.
  // Checking it checks everything; unchecking any single box turns it off.
  const toggleSurprise = () => onChange(surprise ? [] : [...CATEGORIES])

  return (
    <fieldset className={styles.fieldset}>
      <legend className={styles.legend}>What kind of toppings?</legend>
      <div className={styles.row}>
        {CATEGORIES.map((c) => (
          <label key={c} className={`${styles.chip} ${styles[c]}`}>
            <input
              type="checkbox"
              checked={selected.includes(c)}
              onChange={() => toggle(c)}
            />
            <span>{c}</span>
          </label>
        ))}
        <label className={`${styles.chip} ${styles.surprise}`}>
          <input type="checkbox" checked={surprise} onChange={toggleSurprise} />
          <span>surprise me</span>
        </label>
      </div>
    </fieldset>
  )
}
