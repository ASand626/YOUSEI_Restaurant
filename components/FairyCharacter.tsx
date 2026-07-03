"use client";
import { motion } from "framer-motion";

export type FairyState = "idle" | "happy" | "thinking";

export default function FairyCharacter({ state }: { state: FairyState }) {
  return (
    <div className="flex flex-col items-center select-none">
      <motion.div
        animate={
          state === "happy"
            ? { y: [0, -12, 0, -12, 0], rotate: [-5, 5, -5, 5, 0] }
            : state === "thinking"
            ? { rotate: [-8, 0, -8, 0], x: [0, 2, 0, -2, 0] }
            : { y: [0, -5, 0] }
        }
        transition={
          state === "happy"
            ? { duration: 0.5, repeat: 2, repeatType: "loop" }
            : state === "thinking"
            ? { duration: 1.4, repeat: Infinity, ease: "easeInOut" }
            : { duration: 2.5, repeat: Infinity, ease: "easeInOut" }
        }
      >
        <svg
          width="90"
          height="110"
          viewBox="0 0 120 140"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Wings left */}
          <ellipse
            cx="25"
            cy="82"
            rx="22"
            ry="36"
            fill="#C8F0FF"
            fillOpacity="0.8"
            stroke="#90D5F0"
            strokeWidth="1.5"
            transform="rotate(-28 25 82)"
          />
          <ellipse
            cx="25"
            cy="82"
            rx="13"
            ry="22"
            fill="#E8F8FF"
            fillOpacity="0.6"
            transform="rotate(-28 25 82)"
          />

          {/* Wings right */}
          <ellipse
            cx="95"
            cy="82"
            rx="22"
            ry="36"
            fill="#C8F0FF"
            fillOpacity="0.8"
            stroke="#90D5F0"
            strokeWidth="1.5"
            transform="rotate(28 95 82)"
          />
          <ellipse
            cx="95"
            cy="82"
            rx="13"
            ry="22"
            fill="#E8F8FF"
            fillOpacity="0.6"
            transform="rotate(28 95 82)"
          />

          {/* Body */}
          <ellipse
            cx="60"
            cy="108"
            rx="27"
            ry="22"
            fill="#FFE4B5"
            stroke="#FFDAB9"
            strokeWidth="2"
          />

          {/* Head */}
          <circle
            cx="60"
            cy="72"
            r="31"
            fill="#FFE4B5"
            stroke="#FFDAB9"
            strokeWidth="2"
          />

          {/* Bread hat – layered for depth */}
          <ellipse cx="60" cy="43" rx="27" ry="12" fill="#C8914A" />
          <ellipse cx="60" cy="42" rx="24" ry="10" fill="#E8B06A" />
          <ellipse cx="60" cy="41" rx="21" ry="8.5" fill="#F5C878" />
          {/* Hat sesame dots */}
          <circle cx="55" cy="39" r="1.5" fill="#C8914A" opacity="0.7" />
          <circle cx="62" cy="38" r="1.5" fill="#C8914A" opacity="0.7" />
          <circle cx="68" cy="40" r="1.5" fill="#C8914A" opacity="0.7" />

          {/* Eyes */}
          {state === "happy" ? (
            <>
              <path
                d="M47 69 Q52 64 57 69"
                stroke="#5D4037"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M63 69 Q68 64 73 69"
                stroke="#5D4037"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
              />
            </>
          ) : (
            <>
              <circle cx="52" cy="69" r="5.5" fill="#5D4037" />
              <circle cx="68" cy="69" r="5.5" fill="#5D4037" />
              <circle cx="53.5" cy="67.5" r="2" fill="white" />
              <circle cx="69.5" cy="67.5" r="2" fill="white" />
              {state === "thinking" && (
                <>
                  {/* Raised inner brow for confused look */}
                  <path
                    d="M48 62 Q52 59 56 61"
                    stroke="#8B6914"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                  />
                  <path
                    d="M64 61 Q68 59 72 62"
                    stroke="#8B6914"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                  />
                </>
              )}
            </>
          )}

          {/* Cheeks */}
          <circle cx="42" cy="75" r="7" fill="#FFB3B3" fillOpacity="0.5" />
          <circle cx="78" cy="75" r="7" fill="#FFB3B3" fillOpacity="0.5" />

          {/* Mouth */}
          {state === "thinking" ? (
            <path
              d="M52 83 Q60 80 68 83"
              stroke="#FF8C69"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />
          ) : (
            <path
              d="M50 82 Q60 90 70 82"
              stroke="#FF8C69"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />
          )}

          {/* Arms */}
          <path
            d="M35 102 Q24 92 28 80"
            stroke="#FFE4B5"
            strokeWidth="9"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M85 102 Q96 92 92 80"
            stroke="#FFE4B5"
            strokeWidth="9"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </motion.div>

      {/* Fairy name tag */}
      <span className="text-xs font-black text-amber-700 mt-0.5 tracking-wide">
        ぱんまる
      </span>

      {/* Happy sparkles (floating, outside SVG) */}
      {state === "happy" && (
        <div className="absolute pointer-events-none">
          {["✨", "⭐", "💫", "✨", "🌟"].map((s, i) => (
            <motion.span
              key={i}
              className="absolute text-lg"
              style={{ left: (i - 2) * 28, top: 0 }}
              initial={{ opacity: 0, y: 0, scale: 0 }}
              animate={{ opacity: [0, 1, 0], y: -80, scale: [0, 1.2, 0] }}
              transition={{ delay: i * 0.12, duration: 1.2 }}
            >
              {s}
            </motion.span>
          ))}
        </div>
      )}
    </div>
  );
}
