import { NextResponse } from "next/server"
import crypto from "crypto"

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    // Kullanici adi kontrolu
    if (username !== "admin") {
      return NextResponse.json(
        { error: "Gecersiz kullanici adi veya sifre" },
        { status: 401 }
      )
    }

    // Sifreyi SHA-256 ile hashle
    const hashedPassword = crypto
      .createHash("sha256")
      .update(password)
      .digest("hex")

    // .env'deki hash ile karsilastir
    const validHash = process.env.ADMIN_PASSWORD_HASH

    if (!validHash || hashedPassword !== validHash) {
      return NextResponse.json(
        { error: "Gecersiz kullanici adi veya sifre" },
        { status: 401 }
      )
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { error: "Bir hata olustu" },
      { status: 500 }
    )
  }
}
