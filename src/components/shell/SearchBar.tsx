type SearchBarProps = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export default function SearchBar({
  value,
  onChange,
  placeholder = 'Search components…',
}: SearchBarProps) {
  return (
    <div className="px-3 pb-2">
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-md border border-brandcolor-200 bg-white px-2 py-1.5 text-[13px] text-brandcolor-900 placeholder:text-brandcolor-500"
      />
    </div>
  )
}
