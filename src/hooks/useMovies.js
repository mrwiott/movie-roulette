import { useState, useCallback } from 'react'
import { movies } from '../data/movies'

const STORAGE_KEY = 'movie-roulette-watched'

function loadWatched() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? new Set(JSON.parse(raw)) : new Set()
  } catch {
    return new Set()
  }
}

function saveWatched(set) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]))
}

export function useMovies() {
  const [watched, setWatched] = useState(loadWatched)

  const toggleWatched = useCallback((id) => {
    setWatched(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      saveWatched(next)
      return next
    })
  }, [])

  const markWatched = useCallback((id) => {
    setWatched(prev => {
      if (prev.has(id)) return prev
      const next = new Set(prev)
      next.add(id)
      saveWatched(next)
      return next
    })
  }, [])

  const unwatched = movies.filter(m => !watched.has(m.id))
  const watchedCount = watched.size

  return { movies, watched, unwatched, watchedCount, toggleWatched, markWatched }
}
