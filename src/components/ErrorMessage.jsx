// Error box with an optional retry button.
function ErrorMessage({ message, onRetry }) {
  return (
    <div className="state-box state-box--error" role="alert">
      <p>{message}</p>
      {onRetry && (
        <button type="button" className="btn" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  )
}

export default ErrorMessage
