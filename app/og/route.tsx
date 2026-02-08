import { ImageResponse } from "next/og"

export const runtime = "edge"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)

  const title = searchParams.get("title") ?? "Berkay Blog"
  const excerpt = searchParams.get("excerpt") ?? "Tech, systems, future."

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(180deg, #fafafa, #f1f1f1)",
          fontFamily: "Inter, sans-serif",
        }}
      >
        {/* Accent line */}
        <div
          style={{
            width: 60,
            height: 4,
            background: "#000",
            marginBottom: 40,
            display: "flex",
          }}
        />

        <h1
          style={{
            fontSize: 64,
            fontWeight: 700,
            lineHeight: 1.1,
            color: "#111",
            margin: 0,
          }}
        >
          {title}
        </h1>

        <p
          style={{
            marginTop: 32,
            fontSize: 32,
            color: "#555",
            lineHeight: 1.4,
          }}
        >
          {excerpt}
        </p>

        <span
          style={{
            position: "absolute",
            bottom: 60,
            left: 80,
            fontSize: 20,
            color: "#999",
          }}
        >
          berkay.blog
        </span>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
