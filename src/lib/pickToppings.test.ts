import { describe, expect, it } from 'vitest'
import data from '../data/waffle-toppings.json'
import { clampCount, pickToppings, poolFor } from './pickToppings'
import type { Category, Topping } from './types'

const toppings = data as Topping[]

describe('data', () => {
  it('has the expected pools', () => {
    expect(toppings).toHaveLength(118)
    expect(poolFor(toppings, 'sweet')).toHaveLength(41)
    expect(poolFor(toppings, 'savory')).toHaveLength(37)
    expect(poolFor(toppings, 'silly')).toHaveLength(40)
  })
})

describe('pickToppings', () => {
  it('only returns toppings from the selected category', () => {
    for (let i = 0; i < 50; i++) {
      const r = pickToppings(toppings, ['savory'], 5)
      expect(r).toHaveLength(5)
      r.forEach((p) => expect(p.topping.tags).toContain('savory'))
    }
  })

  it('returns no duplicates', () => {
    const r = pickToppings(toppings, ['sweet', 'silly', 'savory'], 8)
    expect(new Set(r.map((p) => p.topping.id)).size).toBe(8)
  })

  it('mixes categories: 3 across all three gives one of each', () => {
    const all: Category[] = ['sweet', 'silly', 'savory']
    for (let i = 0; i < 50; i++) {
      const cats = pickToppings(toppings, all, 3).map((p) => p.category).sort()
      expect(cats).toEqual(['savory', 'silly', 'sweet'])
    }
  })

  it('balances two categories', () => {
    const r = pickToppings(toppings, ['sweet', 'savory'], 4)
    expect(r.filter((p) => p.category === 'sweet')).toHaveLength(2)
    expect(r.filter((p) => p.category === 'savory')).toHaveLength(2)
  })

  it('returns nothing with no categories', () => {
    expect(pickToppings(toppings, [], 3)).toEqual([])
  })

  it('clamps count', () => {
    expect(clampCount(0)).toBe(1)
    expect(clampCount(99)).toBe(8)
    expect(clampCount(NaN)).toBe(1)
    expect(pickToppings(toppings, ['sweet'], 99)).toHaveLength(8)
  })

  it('avoids the previous set when the pool is big enough', () => {
    for (let i = 0; i < 50; i++) {
      const first = pickToppings(toppings, ['silly'], 8)
      const ids = first.map((p) => p.topping.id)
      const second = pickToppings(toppings, ['silly'], 8, ids)
      second.forEach((p) => expect(ids).not.toContain(p.topping.id))
    }
  })

  it('falls back to repeats when the pool is too small', () => {
    const tiny: Topping[] = [
      { id: 'a', name: 'a', tags: ['sweet'] },
      { id: 'b', name: 'b', tags: ['sweet'] },
    ]
    const r = pickToppings(tiny, ['sweet'], 2, ['a', 'b'])
    expect(r).toHaveLength(2)
  })

  it('is deterministic with a seeded rng', () => {
    const mk = () => { let s = 1; return () => (s = (s * 16807) % 2147483647) / 2147483647 }
    expect(pickToppings(toppings, ['sweet', 'silly'], 4, [], mk()))
      .toEqual(pickToppings(toppings, ['sweet', 'silly'], 4, [], mk()))
  })
})
