import { useState, useRef, useEffect } from 'react'
import { TMDB_IMAGE_BASE, POSTER_PATHS } from '../data/movies'
import styles from './MovieCard.module.css'

export default function MovieCard({ movie, isWatched, onToggle }) {
  const [scratching, setScratching] = useState(false)
  const [revealed, setRevealed] = useState(isWatched)
  const timerRef = useRef(null)

  useEffect(() => {
    setRevealed(isWatched)
  }, [isWatched])

  function handlePress() {
    if (scratching) return
    setScratching(true)
    timerRef.current = setTimeout(() => {
      setScratching(false)
      setRevealed(true)
      onToggle(movie.id)
    }, 500)
  }

  function handleRelease() {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    setScratching(false)
  }

  const posterSrc = TMDB_IMAGE_BASE + POSTER_PATHS[movie.tmdbId]

  return (
    <div
      className={`${styles.card} ${isWatched ? styles.watched : ''} ${scratching ? styles.scratching : ''}`}
      onPointerDown={handlePress}
      onPointerUp={handleRelease}
      onPointerLeave={handleRelease}
    >
      <div className={styles.inner}>
        <img
          src={posterSrc}
          alt={movie.title}
          className={styles.poster}
          loading="lazy"
          draggable={false}
        />
        <div className={styles.scratchOverlay}>
          <span className={styles.scratchIcon}>✦</span>
        </div>
        {isWatched && (
          <div className={styles.watchedBadge}>
            <svg viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="11" fill="#C9A84C" />
              <path d="M7 12.5l3.5 3.5 6.5-7" stroke="#111" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        )}
      </div>
      <p className={styles.title}>{movie.title}</p>
    </div>
  )
}
