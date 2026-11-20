import { MAX_COUNT, MIN_COUNT } from './types'

export interface Slot {
  /** Center position, percent of the waffle. */
  x: number
  y: number
  /** Degrees. */
  rotate: number
}

/** Hand-tuned, non-overlapping anchor points (percent) for each count. */
const ANCHORS: Record<number, [number, number][]> = {
  1: [[50, 50]],
  2: [[50, 30], [50, 70]],
  3: [[40, 24], [60, 50], [40, 76]],
  4: [[32, 28], [68, 28], [32, 72], [68, 72]],
  5: [[30, 18], [70, 18], [50, 50], [30, 82], [70, 82]],
  6: [[30, 20], [70, 20], [30, 50], [70, 50], [30, 80], [70, 80]],
  7: [[30, 14], [70, 14], [30, 38], [70, 38], [30, 62], [70, 62], [50, 86]],
  8: [[28, 14], [72, 14], [28, 38], [72, 38], [28, 62], [72, 62], [28, 86], [72, 86]],
}

/** Font size as a percent of waffle width (used with container query units). */
const FONT_CQW: Record<number, number> = { 1: 10, 2: 8.5, 3: 7.5, 4: 6.5, 5: 5.8, 6: 5.4, 7: 5, 8: 4.7 }

/** Max word width as a percent of the waffle. */
export function maxWidthFor(count: number): number {
  return count <= 4 ? 70 : 38
}

export function fontSizeFor(count: number): number {
  return FONT_CQW[clamp(count)]
}

function clamp(n: number) {
  return Math.min(MAX_COUNT, Math.max(MIN_COUNT, n))
}

/** Anchors with a little random offset and rotation so results look scattered. */
export function layoutFor(count: number, rng: () => number = Math.random): Slot[] {
  const jitter = (range: number) => (rng() * 2 - 1) * range
  return ANCHORS[clamp(count)].map(([x, y]) => ({
    x: x + jitter(count <= 2 ? 6 : 2.5),
    y: y + jitter(2),
    rotate: jitter(6),
  }))
}
