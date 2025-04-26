import Link from "next/link"

interface LogoProps {
  className?: string
}

export function Logo({ className = "" }: LogoProps) {
  return (
    <Link href="/" className={`text-[#141b34] font-serif italic text-xl ${className}`}>
      <div className="flex items-center">
        <span className="font-serif italic">Lukhish</span>
        <span className="text-xs ml-1 mt-auto mb-1">COUNSELING</span>
      </div>
    </Link>
  )
}
