export function Field({
  id,
  label,
  error,
  className = "",
  ...props
}: { id: string; label: string; error?: string; className?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={className}>
      <label htmlFor={id} className="label">
        {label}
      </label>
      <input id={id} name={id} className="field" aria-invalid={!!error} aria-describedby={error ? `${id}-err` : undefined} {...props} />
      {error && (
        <p id={`${id}-err`} role="alert" className="err">
          {error}
        </p>
      )}
    </div>
  );
}
