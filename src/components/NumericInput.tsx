import { useState, useEffect, useRef } from 'react'

interface NumericInputProps {
  value: number
  onChange: (n: number) => void
  min?: number
  className?: string
  'aria-label'?: string
}

/**
 * Number input that lets users freely clear and retype without the field
 * snapping back to 0 mid-edit. Commits to onChange only on blur.
 */
export default function NumericInput({ value, onChange, min = 0, className, 'aria-label': ariaLabel }: NumericInputProps) {
  const [str, setStr] = useState(String(value))
  const focusedRef = useRef(false)

  // sync from parent only when the field is not focused
  useEffect(() => {
    if (!focusedRef.current) setStr(String(value))
  }, [value])

  return (
    <input
      type="number"
      min={min}
      value={str}
      aria-label={ariaLabel}
      className={className}
      onChange={(e) => setStr(e.target.value)}
      onFocus={(e) => { focusedRef.current = true; e.target.select() }}
      onBlur={() => {
        focusedRef.current = false
        const n = parseFloat(str)
        const final = isNaN(n) ? 0 : Math.max(min, n)
        onChange(final)
        setStr(String(final))
      }}
    />
  )
}
