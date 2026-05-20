import { useState } from 'react'
import { useMovies } from './hooks/useMovies'
import BottomNav from './components/BottomNav'
import Poster from './components/Poster'
import Roulette from './components/Roulette'
import Novedades from './components/Novedades'
import styles from './App.module.css'

export default function App() {
  const [tab, setTab] = useState('poster')
  const { movies, watched, unwatched, watchedCount, toggleWatched, markWatched } = useMovies()

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <span className={styles.logo}>✦</span>
        <span className={styles.title}>Movie Roulette</span>
        <span className={styles.count}>{watchedCount}/48</span>
      </header>

      <main className={styles.main}>
        {tab === 'poster' && (
          <Poster
            movies={movies}
            watched={watched}
            watchedCount={watchedCount}
            onToggle={toggleWatched}
          />
        )}
        {tab === 'roulette' && (
          <Roulette
            unwatched={unwatched}
            watchedCount={watchedCount}
            total={48}
            onMark={markWatched}
          />
        )}
        {tab === 'novedades' && <Novedades />}
      </main>

      <BottomNav active={tab} onChange={setTab} />
    </div>
  )
}
