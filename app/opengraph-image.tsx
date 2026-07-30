import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#4A5E48",
          backgroundImage:
            "radial-gradient(circle at 75% 20%, rgba(194,150,58,0.16) 0%, transparent 55%), radial-gradient(circle at 15% 85%, rgba(74,94,72,0.35) 0%, transparent 50%)",
        }}
      >
        <div
          style={{
            fontSize: 30,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#C2963A",
            marginBottom: 24,
            display: "flex",
          }}
        >
          For licensed clinicians in Austin, TX
        </div>
        <div
          style={{
            fontSize: 96,
            color: "#fff",
            fontWeight: 400,
            display: "flex",
          }}
        >
          Austin Clinician Circle
        </div>
        <div
          style={{
            fontSize: 32,
            color: "rgba(255,255,255,0.65)",
            marginTop: 20,
            display: "flex",
          }}
        >
          Deepen your work. Find your community.
        </div>
      </div>
    ),
    { ...size }
  );
}
