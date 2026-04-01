import { ImageResponse } from "next/og";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          overflow: "hidden",
          display: "flex",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://github.com/rowkav09.png"
          width={32}
          height={32}
          style={{ borderRadius: "50%" }}
        />
      </div>
    ),
    { width: 32, height: 32 },
  );
}
