import { useState } from 'react'
import { useError } from './useError'

export const useLocalStorage = (key, initialValue) => {

  const { setError } = useError()

  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      return initialValue
    }
  })

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      SetError(`Error writing to localStorage key "${key}"`)
    }
  }

  return [storedValue, setValue]
}