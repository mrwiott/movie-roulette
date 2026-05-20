import { useState } from 'react'
import MovieCard from './MovieCard'
import { CATEGORIES } from '../data/movies'
import styles from './Poster.module.css'

const TABS = [
  { id: 'all', label: 'Todas' },
  { id: CATEGORIES.CLASSICS, label: 'Clásicos' },
  { id: CATEGORIES.POPULAR, label: 'Popular' },
]

export default function Poster({ movies, watched, watchedCount, onToggle }) {
  const [activeTab, setActiveTab] = useState('all')

  const filtered = activeTab === 'all'
    ? movies
    : movies.filter(m => m.category === activeTab)

  const classics = movies.filter(m => m.category === CATEGORIES.CLASSICS)
  const popular = movies.filter(m => m.category === CATEGORIES.POPULAR)
  const classicsWatched = classics.filter(m => watched.has(m.id)).length
  const popularWatched = popular.filter(m => watched.has(m.id)).length

  return (
    <div className={styles.container}>
      <div className={styles.progress}>
        <div className={styles.progressMain}>
          <span className={styles.progressCount}>{watchedCount}</span>
          <span className={styles.progressSep}>/</span>
          <span className={styles.progressTotal}>48</span>
          <span className={styles.progressLabel}>vistas</span>
        </div>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${(watchedCount / 48) * 100}%` }} />
        </div>
        <div className={styles.progressSubs}>
          <span>Clásicos {classicsWatched}/24</span>
          <span>Popular {popularWatched}/24</span>
        </div>
      </div>

      <div className={styles.tabs}>
        {TABS.map(t => (
          <button
            key={t.id}
            className={`${styles.tab} ${activeTab === t.id ? styles.tabActive : ''}`}
            onClick={() => setActiveTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'all' ? (
        <>
          <SectionGrid
            title="Clásicos del Cine"
            movies={classics}
            watched={watched}
            onToggle={onToggle}
          />
          <SectionGrid
            title="Cultura Popular"
            movies={popular}
            watched={watched}
            onToggle={onToggle}
          />
        </>
      ) : (
        <div className={styles.grid}>
          {filtered.map(m => (
            <MovieCard key={m.id} movie={m} isWatched={watched.has(m.id)} onToggle={onToggle} />
          ))}
        </div>
      )}
    </div>
  )
}

function SectionGrid({ title, movies, watched, onToggle }) {
  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      <div className={styles.grid}>
        {movies.map(m => (
          <MovieCard key={m.id} movie={m} isWatched={watched.has(m.id)} onToggle={onToggle} />
        ))}
      </div>
    </div>
  )
}
