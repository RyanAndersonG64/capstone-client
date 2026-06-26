import { useState } from "react"
import { useError } from '../contexts/useError'

export const useLocalStorage = (key, initialValue) => {

    const { setError } = useError()

    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key)
            return item ? JSON.parse(item) : initialValue
        }
        catch (error) {
            setError("Error reading local storage")
            return initialValue
        }
    })

    const setValue = (value) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value
            setStoredValue(valueToStore)
            window.localStorage.setItem(key, JSON.stringify(valueToStore))
        }
        catch (error) {
            setError("Error writing to local storage")
            return initialValue
        }
    }

    return [storedValue, setValue]
}