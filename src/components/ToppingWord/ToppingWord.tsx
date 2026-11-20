import { motion, useReducedMotion } from 'framer-motion'
import { fontSizeFor, maxWidthFor, type Slot } from '../../lib/layout'
import type { Category } from '../../lib/types'
import styles from './ToppingWord.module.css'

interface Props {
  name: string
  category: Category
  slot: Slot
  count: number
  index: number
}

export function ToppingWord({ name, category, slot, count, index }: Props) {
  const reduce = useReducedMotion()
  const delay = index * 0.18

  return (
    // Outer element handles placement; inner motion element handles the animation.
    <div
      className={styles.place}
      style={{ left: `${slot.x}%`, top: `${slot.y}%`, maxWidth: `${maxWidthFor(count)}%` }}
    >
      <motion.span
        className={`${styles.word} ${styles[category]}`}
        style={{ fontSize: `${fontSizeFor(count)}cqw`, rotate: slot.rotate }}
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: -140, scale: 1.15 }}
        animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
        transition={
          reduce
            ? { duration: 0.4, delay }
            : { type: 'spring', stiffness: 380, damping: 11, mass: 0.9, delay }
        }
      >
        {name}
      </motion.span>
    </div>
  )
}
