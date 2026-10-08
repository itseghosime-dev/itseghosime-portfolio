import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt =
  "ITSEGHOSIME — Frontend Developer and Software Engineer portfolio";
export const size = { height: 630, width: 1200 };
export const contentType = "image/png";

const newsreader = readFile(
  join(process.cwd(), "assets/Newsreader.ttf"),
);

export default async function OpenGraphImage() {
  const newsreaderFont = await newsreader;

  return new ImageResponse(
    (
      <div
        style={{
          background: "#faf9f4",
          color: "#171717",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "space-between",
          overflow: "hidden",
          padding: "64px 72px",
          position: "relative",
          width: "100%",
        }}
      >
        <div
          style={{
            background:
              "radial-gradient(circle at center, rgba(65, 105, 225, 0.26), rgba(65, 105, 225, 0.08) 38%, transparent 70%)",
            display: "flex",
            height: 620,
            position: "absolute",
            right: -120,
            top: -210,
            width: 620,
          }}
        />

        <div
          style={{
            alignItems: "center",
            display: "flex",
            fontFamily: "Arial, sans-serif",
            fontSize: 23,
            fontWeight: 700,
            letterSpacing: "-0.02em",
          }}
        >
          <svg
            height="20"
            style={{ marginRight: 14, transform: "rotate(-8deg)" }}
            viewBox="0 0 20 20"
            width="20"
          >
            <path d="M10 1.5 18.5 18.5H1.5Z" fill="#171717" />
          </svg>
          ITSEGHOSIME
        </div>

        <div style={{ display: "flex", flexDirection: "column", width: 890 }}>
          <div
            style={{
              color: "#4169e1",
              display: "flex",
              fontFamily: "monospace",
              fontSize: 16,
              fontWeight: 700,
              letterSpacing: "0.12em",
              marginBottom: 22,
              textTransform: "uppercase",
            }}
          >
            Portfolio // Selected work & technical notes
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontFamily: "Newsreader",
              fontSize: 76,
              letterSpacing: "-0.045em",
              lineHeight: 0.98,
            }}
          >
            <span>Thoughtful interfaces.</span>
            <span>Engineered with care.</span>
          </div>
        </div>

        <div
          style={{
            alignItems: "center",
            borderTop: "1px solid rgba(23, 23, 23, 0.16)",
            display: "flex",
            fontFamily: "monospace",
            fontSize: 15,
            justifyContent: "space-between",
            letterSpacing: "0.06em",
            paddingTop: 22,
            textTransform: "uppercase",
          }}
        >
          <span>Abdulrahman Itseghosime Bello</span>
          <span style={{ color: "#606060" }}>itseghosime.com</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          data: newsreaderFont,
          name: "Newsreader",
          style: "normal",
          weight: 400,
        },
      ],
    },
  );
}
