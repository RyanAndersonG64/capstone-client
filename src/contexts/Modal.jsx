import { useEffect, useRef, useState } from 'react'

/**
 * The dialog itself. It is rendered by ModalProvider rather than by pages, and
 * reports the user's answer through onClose:
 *   - confirm: true when accepted, false when dismissed
 *   - prompt:  the entered text when accepted, null when dismissed
 */
const Modal = ({
  type,
  message,
  confirmText,
  cancelText = 'Cancel',
  defaultValue = '',
  onClose,
}) => {
  const isPrompt = type === 'prompt'
  const [value, setValue] = useState(defaultValue)
  const inputRef = useRef(null)
  const cancelRef = useRef(null)

  const dismiss = () => onClose(isPrompt ? null : false)

  // focus the input on a prompt, otherwise the cancel button -- these dialogs
  // confirm destructive actions, so cancel is the safer thing to land Enter on
  useEffect(() => {
    if (isPrompt) {
      inputRef.current?.focus()
      inputRef.current?.select()
    } else {
      cancelRef.current?.focus()
    }
  }, [isPrompt])

  // Escape closes the dialog the same way the cancel button does
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose(isPrompt ? null : false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isPrompt, onClose])

  const submitDisabled = isPrompt && value.trim() === ''

  // submitting the form covers both the Enter key and the confirm button
  const handleSubmit = (e) => {
    e.preventDefault()
    if (submitDisabled) return
    onClose(isPrompt ? value.trim() : true)
  }

  return (
    <div
      className="modal-backdrop-custom"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) dismiss()
      }}
    >
      <div className="modal-dialog-custom" role="dialog" aria-modal="true" aria-labelledby="modal-message">
        <form onSubmit={handleSubmit}>
          <p className="modal-message" id="modal-message">{message}</p>

          {isPrompt && (
            <input
              ref={inputRef}
              className="modal-input"
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          )}

          <div className="modal-buttons">
            <button ref={cancelRef} type="button" className="modal-button" onClick={dismiss}>
              {cancelText}
            </button>
            <button type="submit" className="modal-button modal-button-confirm" disabled={submitDisabled}>
              {confirmText || (isPrompt ? 'Submit' : 'Confirm')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Modal
