import { useState } from 'react'

// Two-step cancel: first click asks "Are you sure?", second click confirms.
function CancelButton({ onConfirm }) {
  const [confirming, setConfirming] = useState(false)

  if (!confirming) {
    return (
      <button type="button" className="btn btn--secondary" onClick={() => setConfirming(true)}>
        Cancel registration
      </button>
    )
  }
  return (
    <div className="confirm-row" role="alertdialog" aria-label="Confirm cancellation">
      <span>Cancel this registration?</span>
      <button type="button" className="btn btn--danger" onClick={onConfirm}>
        Yes, cancel
      </button>
      <button type="button" className="btn btn--secondary" onClick={() => setConfirming(false)}>
        Keep it
      </button>
    </div>
  )
}

export default CancelButton
