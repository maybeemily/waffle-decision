import type { ReactNode } from 'react'
import styles from './Waffle.module.css'

const PAD = 36
const GRID = 4
const CELL = (400 - PAD * 2) / GRID

export function Waffle({ children }: { children?: ReactNode }) {
  const pockets = []
  for (let r = 0; r < GRID; r++) {
    for (let c = 0; c < GRID; c++) {
      pockets.push(
        <rect
          key={`${r}-${c}`}
          x={PAD + c * CELL + 6}
          y={PAD + r * CELL + 6}
          width={CELL - 12}
          height={CELL - 12}
          rx="9"
          fill="url(#pocket)"
          stroke="#a8691a"
          strokeOpacity="0.45"
          strokeWidth="1.5"
        />,
      )
    }
  }
  return (
    <div className={styles.wrap}>
      <svg className={styles.svg} viewBox="0 0 400 400" role="img" aria-label="A golden waffle">
        <defs>
          <linearGradient id="crust" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#f6c25c" />
            <stop offset="1" stopColor="#d9902a" />
          </linearGradient>
          <radialGradient id="pocket" cx="0.35" cy="0.3" r="0.9">
            <stop offset="0" stopColor="#efb040" />
            <stop offset="1" stopColor="#cc8420" />
          </radialGradient>
        </defs>
        <rect x="8" y="14" width="384" height="384" rx="52" fill="#8f5a14" opacity="0.35" />
        <rect x="8" y="8" width="384" height="384" rx="52" fill="url(#crust)" stroke="#b97a1c" strokeWidth="4" />
        <rect x="22" y="22" width="356" height="356" rx="40" fill="none" stroke="#fff" strokeOpacity="0.25" strokeWidth="3" />
        {pockets}
        {/* butter pat */}
        <g transform="rotate(-8 200 200)">
          <rect x="172" y="184" width="56" height="34" rx="6" fill="#fff2a8" stroke="#e6cf62" strokeWidth="2" />
          <rect x="178" y="188" width="30" height="7" rx="3.5" fill="#fffbd6" />
        </g>
      </svg>
      <div className={styles.layer}>{children}</div>
    </div>
  )
}
