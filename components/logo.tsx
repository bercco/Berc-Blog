import Image from "next/image"
import Link from "next/link"

export function Logo() {
  return (
    <Link href="/" className="relative w-24 h-24 block">
      <Image
        src="https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg" // Replace with your actual Cloudinary URL
        alt="SDFM 2520"
        fill
        className="object-contain"
        priority
      />
    </Link>
  )
}
