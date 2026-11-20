import { useState } from 'react'
import styles from './App.module.css'
import data from './data/waffle-toppings.json'
import { CategoryPicker } from './components/CategoryPicker/CategoryPicker'
import { CountSlider } from './components/CountSlider/CountSlider'
import { DecideButton } from './components/DecideButton/DecideButton'
import { ToppingWord } from './components/ToppingWord/ToppingWord'
import { Waffle } from './components/Waffle/Waffle'
import { layoutFor, type Slot } from './lib/layout'
import { pickToppings } from './lib/pickToppings'
import { CATEGORIES, DEFAULT_COUNT, type Category, type Pick, type Topping } from './lib/types'

const toppings = data as Topping[]

interface Result {
  round: number
  picks: Pick[]
  slots: Slot[]
}

export default function App() {
  const [categories, setCategories] = useState<Category[]>([...CATEGORIES])
  const [count, setCount] = useState(DEFAULT_COUNT)
  const [result, setResult] = useState<Result | null>(null)

  const decide = () => {
    const picks = pickToppings(
      toppings,
      categories,
      count,
      result?.picks.map((p) => p.topping.id),
    )
    setResult({ round: (result?.round ?? 0) + 1, picks, slots: layoutFor(picks.length) })
  }

  const summary = result
    ? `Your waffle: ${result.picks.map((p) => p.topping.name).join(', ')}`
    : ''

  return (
    <main className={styles.app}>
      <h1 className={styles.title}>Waffle Decision</h1>
      <p className={styles.sub}>Can't decide what goes on your waffle? Let fate pour the syrup.</p>

      <Waffle>
        {result?.picks.map((p, i) => (
          <ToppingWord
            key={`${result.round}-${p.topping.id}`}
            name={p.topping.name}
            category={p.category}
            slot={result.slots[i]}
            count={result.picks.length}
            index={i}
          />
        ))}
      </Waffle>
      <p className={`visually-hidden`} role="status" aria-live="polite">
        {summary}
      </p>

      <section className={styles.controls}>
        <CategoryPicker selected={categories} onChange={setCategories} />
        <CountSlider value={count} onChange={setCount} />
        <div className={styles.action}>
          <DecideButton
            hasResult={result !== null}
            disabled={categories.length === 0}
            onClick={decide}
          />
          {categories.length === 0 && <p className={styles.hint}>Pick at least one kind.</p>}
        </div>
      </section>
    </main>
  )
}
