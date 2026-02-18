/**
 * Reusable labeled input with optional prefix/suffix (e.g. $ or %)
 */
export default function InputField({
  label,
  id,
  type = 'number',
  value,
  onChange,
  prefix,
  suffix,
  min,
  max,
  step,
  placeholder,
  hint,
}) {
  return (
    <div>
      <label htmlFor={id} className="input-label">
        {label}
      </label>
      <div className="relative flex items-center">
        {prefix && (
          <span className="absolute left-3 text-gray-500 text-sm select-none">{prefix}</span>
        )}
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          min={min}
          max={max}
          step={step}
          placeholder={placeholder}
          className={`input-field ${prefix ? 'pl-7' : ''} ${suffix ? 'pr-8' : ''}`}
        />
        {suffix && (
          <span className="absolute right-3 text-gray-500 text-sm select-none">{suffix}</span>
        )}
      </div>
      {hint && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
    </div>
  )
}
