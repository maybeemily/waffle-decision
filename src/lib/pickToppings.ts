import { MAX_COUNT, MIN_COUNT, type Category, type Pick, type Topping } from './types'

type Rng = () => number

/** Fisher–Yates shuffle (returns a new array). */
export function shuffle<T>(items: readonly T[], rng: Rng = Math.random): T[] {
  const a = [...items]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function clampCount(n: number): number {
  if (!Number.isFinite(n)) return MIN_COUNT
  return Math.min(MAX_COUNT, Math.max(MIN_COUNT, Math.round(n)))
}

export function poolFor(toppings: readonly Topping[], category: Category): Topping[] {
  return toppings.filter((t) => t.tags.includes(category))
}

/**
 * Pick `count` toppings from the selected categories.
 * One category: shuffle and take N. Several: draw from each in turn so the
 * result is mixed, then shuffle the order. Toppings in `previousIds` are only
 * used when the pool is too small to avoid them.
 */
export function pickToppings(
  toppings: readonly Topping[],
  categories: readonly Category[],
  count: number,
  previousIds: readonly string[] = [],
  rng: Rng = Math.random,
): Pick[] {
  const n = clampCount(count)
  const cats = [...new Set(categories)]
  if (cats.length === 0) return []

  const prev = new Set(previousIds)
  const queues = shuffle(cats, rng).map((category) => {
    const pool = shuffle(poolFor(toppings, category), rng)
    return {
      category,
      queue: [...pool.filter((t) => !prev.has(t.id)), ...pool.filter((t) => prev.has(t.id))],
    }
  })

  const used = new Set<string>()
  const result: Pick[] = []
  while (result.length < n) {
    let progressed = false
    for (const q of queues) {
      if (result.length >= n) break
      while (q.queue.length > 0) {
        const topping = q.queue.shift()!
        if (used.has(topping.id)) continue
        used.add(topping.id)
        result.push({ topping, category: q.category })
        progressed = true
        break
      }
    }
    if (!progressed) break
  }
  return shuffle(result, rng)
}
