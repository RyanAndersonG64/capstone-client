import { createContext, useCallback, useRef, useState } from 'react'
import Modal from './Modal'

export const ModalContext = createContext()

/**
 * Promise-based replacements for window.confirm and window.prompt, so call
 * sites read much the same as the native calls they replaced:
 *
 *   if (await confirm('Are you sure?')) { ... }
 *
 *   const name = await prompt('Enter a group name')
 *   if (name === null) return   // dismissed
 *
 * The dialog is rendered here rather than by each page, so a page can never
 * open one without it being mounted.
 */
export const ModalProvider = ({ children }) => {
  const [modal, setModal] = useState(null)
  const pendingRef = useRef(null)

  const settle = (result) => {
    if (pendingRef.current) {
      pendingRef.current.resolve(result)
      pendingRef.current = null
    }
  }

  const open = useCallback((config) => {
    return new Promise((resolve) => {
      // if a dialog is somehow already open, dismiss it rather than leaving
      // its caller awaiting a promise that can never settle
      if (pendingRef.current) {
        settle(pendingRef.current.type === 'prompt' ? null : false)
      }
      pendingRef.current = { resolve, type: config.type }
      setModal(config)
    })
  }, [])

  const close = useCallback((result) => {
    setModal(null)
    settle(result)
  }, [])

  const confirm = useCallback(
    (message, options = {}) => open({ ...options, type: 'confirm', message }),
    [open]
  )

  const prompt = useCallback(
    (message, options = {}) => open({ ...options, type: 'prompt', message }),
    [open]
  )

  return (
    <ModalContext.Provider value={{ confirm, prompt }}>
      {children}
      {modal && <Modal {...modal} onClose={close} />}
    </ModalContext.Provider>
  )
}
