import GoogleDuotoneIcon from '@/components/GoogleDuotoneIcon'

type CaseSectionPlaceholderProps = {
  title: string
  icon: string
  caseName?: string
}

export default function CaseSectionPlaceholder({
  title,
  icon,
  caseName,
}: CaseSectionPlaceholderProps) {
  return (
    <div className="rounded-md border border-brandcolor-strokeweak bg-brandcolor-white p-6 sm:p-8">
      <div className="flex items-center gap-2">
        <GoogleDuotoneIcon name={icon} className="text-[24px] !text-brandcolor-strokestrong" />
        <h2 className="text-lg font-semibold text-brandcolor-textstrong">{title}</h2>
      </div>
      <p className="mt-2 text-sm text-brandcolor-textweak">
        {caseName
          ? `Content for ${title.toLowerCase()} in ${caseName} will be available soon.`
          : 'Content for this section will be available soon.'}
      </p>
    </div>
  )
}
