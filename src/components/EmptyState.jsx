function EmptyState({ title, message }) {
  return (
    <div className="state-box">
      <h2>{title}</h2>
      {message && <p>{message}</p>}
    </div>
  )
}

export default EmptyState
