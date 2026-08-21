import { Link } from 'react-router-dom'

type BrandLogoProps = {
  to?: string
  className?: string
  imgClassName?: string
}

/** Product mark used in header / sidebar (links to catalog). */
export default function BrandLogo({
  to = '/catalog/home',
  className = '',
  imgClassName = 'h-8 w-auto',
}: BrandLogoProps) {
  return (
    <Link to={to} className={`inline-flex shrink-0 items-center ${className}`} aria-label="GoldFynch home">
      <img
        src="/landing/logo.png"
        alt="GoldFynch"
        className={imgClassName}
        width={401}
        height={78}
      />
    </Link>
  )
}
