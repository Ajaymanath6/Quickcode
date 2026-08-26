type GoogleDuotoneIconProps = {
  name: string
  className?: string
}

/** Google Material outlined icon — strokeweak color (light stroke only). */
export default function GoogleDuotoneIcon({ name, className = '' }: GoogleDuotoneIconProps) {
  return (
    <span
      className={`material-icons-outlined inline-flex shrink-0 items-center justify-center leading-none text-brandcolor-strokeweak ${className}`}
      aria-hidden
    >
      {name}
    </span>
  )
}
