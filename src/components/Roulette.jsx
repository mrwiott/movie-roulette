import { useState, useRef, useEffect } from 'react'
import { TMDB_IMAGE_BASE, POSTER_PATHS } from '../data/movies'
import styles from './Roulette.module.css'

const STATES = {
  IDLE: 'idle',
  SPINNING: 'spinning',
  RESULT: 'result',
}

export default function Roulette({ unwatched, watchedCount, total, onMark }) {
  const [state, setState] = useState(STATES.IDLE)
  const [selected, setSelected] = useState(null)
  const [drumMovies, setDrumMovies] = useState([])
  const [drumOffset, setDrumOffset] = useState(0)
  const drumRef = useRef(null)
  const animRef = useRef(null)

  const allWatched = unwatched.length === 0

  function spin() {
    if (unwatched.length === 0) return

    const pick = unwatched[Math.floor(Math.random() * unwatched.length)]

    const shuffled = [...unwatched].sort(() => Math.random() - 0.5)
    const drum = [...shuffled, ...shuffled, ...shuffled, pick]
    setDrumMovies(drum)
    setDrumOffset(0)
    setState(STATES.SPINNING)

    const ITEM_H = 88
    const totalItems = drum.length
    const targetIndex = totalItems - 1
    const targetOffset = -(targetIndex * ITEM_H) + (ITEM_H * 2)

    let start = null
    const duration = 2600

    function ease(t) {
      return t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2
    }

    const initialOffset = ITEM_H * 2

    function frame(ts) {
      if (!start) start = ts
      const elapsed = ts - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = ease(progress)
      const current = initialOffset + (targetOffset - initialOffset) * eased
      setDrumOffset(current)

      if (progress < 1) {
        animRef.current = requestAnimationFrame(frame)
      } else {
        setSelected(pick)
        setState(STATES.RESULT)
      }
    }

    animRef.current = requestAnimationFrame(frame)
  }

  useEffect(() => {
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current)
    }
  }, [])

  function handleAnswer(answer) {
    if (!selected) return
    if (answer === 'yes') {
      onMark(selected.id)
    }
    setState(STATES.IDLE)
    setSelected(null)
  }

  const posterSrc = selected
    ? TMDB_IMAGE_BASE + POSTER_PATHS[selected.tmdbId]
    : null

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <p className={styles.subtitle}>
          {allWatched
            ? '¡Completaste el póster!'
            : `${unwatched.length} película${unwatched.length !== 1 ? 's' : ''} pendiente${unwatched.length !== 1 ? 's' : ''}`}
        </p>
      </div>

      {state === STATES.IDLE && (
        <div className={styles.idleSection}>
          <div className={styles.wheelDecor}>
            <div className={styles.wheelRing}>
              <svg viewBox="0 0 200 200" className={styles.wheelSvg}>
                {Array.from({ length: 12 }, (_, i) => {
                  const angle = (i / 12) * Math.PI * 2
                  const x1 = 100 + Math.cos(angle) * 60
                  const y1 = 100 + Math.sin(angle) * 60
                  const x2 = 100 + Math.cos(angle) * 90
                  const y2 = 100 + Math.sin(angle) * 90
                  return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#C9A84C" strokeWidth="1.5" opacity="0.3" />
                })}
                <circle cx="100" cy="100" r="90" fill="none" stroke="#C9A84C" strokeWidth="1" opacity="0.15" />
                <circle cx="100" cy="100" r="60" fill="none" stroke="#C9A84C" strokeWidth="1" opacity="0.1" />
                <circle cx="100" cy="100" r="10" fill="#C9A84C" opacity="0.6" />
              </svg>
            </div>
          </div>

          <button
            className={`${styles.spinBtn} ${allWatched ? styles.spinBtnDisabled : ''}`}
            onClick={spin}
            disabled={allWatched}
          >
            <span className={styles.spinBtnText}>Girar Ruleta</span>
            <span className={styles.spinBtnIcon}>▶</span>
          </button>

          {allWatched && (
            <p className={styles.allWatched}>Has visto todas las películas. ¡Increíble!</p>
          )}
        </div>
      )}

      {state === STATES.SPINNING && (
        <div className={styles.drumSection}>
          <div className={styles.drumWindow}>
            <div className={styles.drumHighlight} />
            <div
              className={styles.drum}
              style={{ transform: `translateY(${drumOffset}px)` }}
            >
              {drumMovies.map((m, i) => (
                <div key={`${m.id}-${i}`} className={styles.drumItem}>
                  <img
                    src={TMDB_IMAGE_BASE + POSTER_PATHS[m.tmdbId]}
                    alt={m.title}
                    className={styles.drumPoster}
                  />
                  <span className={styles.drumTitle}>{m.title}</span>
                </div>
              ))}
            </div>
          </div>
          <p className={styles.spinningText}>Buscando tu próxima película...</p>
        </div>
      )}

      {state === STATES.RESULT && selected && (
        <div className={styles.resultSection}>
          <div className={styles.resultCard}>
            <div className={styles.resultPosterWrap}>
              <img src={posterSrc} alt={selected.title} className={styles.resultPoster} />
              <div className={styles.resultGlow} />
            </div>
            <div className={styles.resultInfo}>
              <span className={styles.resultCategory}>
                {selected.category === 'clasicos' ? 'Clásico del Cine' : 'Cultura Popular'}
              </span>
              <h2 className={styles.resultTitle}>{selected.title}</h2>
              <p className={styles.resultYear}>{selected.year}</p>
            </div>
          </div>

          <p className={styles.question}>¿Ya la has visto?</p>

          <div className={styles.answers}>
            <button
              className={`${styles.answerBtn} ${styles.answerYes}`}
              onClick={() => handleAnswer('yes')}
            >
              Sí, la vi
            </button>
            <button
              className={`${styles.answerBtn} ${styles.answerWatch}`}
              onClick={() => handleAnswer('watch')}
            >
              Ahora la veo
            </button>
            <button
              className={`${styles.answerBtn} ${styles.answerNo}`}
              onClick={() => handleAnswer('no')}
            >
              No, otra
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
