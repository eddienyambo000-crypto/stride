import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

/** Branded app/favicon icon — generated, no static asset needed. */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "radial-gradient(120% 120% at 50% 0%, #123a52, #121417 60%)",
          color: "#38bdf8",
          fontSize: 360,
          fontWeight: 700,
          fontFamily: "Georgia, serif",
          fontStyle: "italic",
        }}
      >
        S
      </div>
    ),
    { ...size },
  );
}
