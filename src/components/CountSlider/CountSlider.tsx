import { useId } from 'react'
import { MAX_COUNT, MIN_COUNT } from '../../lib/types'
import styles from './CountSlider.module.css'

interface Props {
  value: number
  onChange: (n: number) => void
}

function countLabel(n: number): string {
  return n === MAX_COUNT ? 'pile it on' : `${n} ${n === 1 ? 'topping' : 'toppings'}`
}

export function CountSlider({ value, onChange }: Props) {
  const id = useId()
  return (
    <div className={styles.wrap}>
      <label htmlFor={id} className={styles.label}>
        How many? <strong>{countLabel(value)}</strong>
      </label>
      <input
        id={id}
        className={styles.range}
        type="range"
        min={MIN_COUNT}
        max={MAX_COUNT}
        step={1}
        value={value}
        aria-valuetext={countLabel(value)}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  )
}
