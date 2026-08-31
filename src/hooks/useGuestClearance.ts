import { useEffect, useState } from 'react'
import {
  clearGuestClearedMemory,
  fetchGuestClearance,
  markGuestCleared,
} from '../lib/guestClearance'


export function useGuestClearance(isGuest: boolean) {
  const [cleared, setCleared] = useState(false)
  const [checking, setChecking] = useState(isGuest)

  useEffect(() => {
    if (!isGuest) {
      setCleared(false)
      setChecking(false)
      return
    }
    let cancelled = false
    setChecking(true)
    void fetchGuestClearance().then((ok) => {
      if (cancelled) return
      setCleared(ok)
      setChecking(false)
    })
    return () => {
      cancelled = true
    }
  }, [isGuest])

  return {
    
    checking: isGuest && checking,
    
    needsTurnstile: isGuest && !checking && !cleared,
    markCleared: () => {
      markGuestCleared()
      setCleared(true)
      setChecking(false)
    },
    invalidate: () => {
      clearGuestClearedMemory()
      setCleared(false)
      setChecking(false)
    },
  }
}
