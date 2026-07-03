"use client";
import { motion, AnimatePresence } from "framer-motion";
import { ValidationResult } from "@/lib/recipeEngine";

const CONFETTI = ["🌟", "⭐", "✨", "🎉", "🎊", "💫", "🌈", "🍳"];

interface Props {
  result: ValidationResult | null;
  stageIcon: string;
  onRetry: () => void;
  onRealCooking: () => void;
  onStageSelect: () => void;
}

export default function ResultOverlay({
  result,
  stageIcon,
  onRetry,
  onRealCooking,
  onStageSelect,
}: Props) {
  return (
    <AnimatePresence>
      {result && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
          style={{ backgroundColor: "rgba(80,40,100,0.55)" }}
        >
          <motion.div
            initial={{ scale: 0.4, opacity: 0, y: 60 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.7, opacity: 0 }}
            transition={{ type: "spring", stiffness: 340, damping: 22 }}
            className="relative rounded-3xl p-7 max-w-xs w-full text-center shadow-2xl overflow-hidden"
            style={{
              background: result.success
                ? "linear-gradient(135deg,#FFFBEA,#F0FFF4)"
                : "linear-gradient(135deg,#FFF5EE,#FFF0F5)",
              borderWidth: 4,
              borderStyle: "solid",
              borderColor: result.success ? "#F6E05E" : "#FEB2A8",
            }}
          >
            {/* Confetti */}
            {result.success &&
              CONFETTI.map((item, i) => (
                <motion.div
                  key={i}
                  className="absolute text-xl pointer-events-none"
                  style={{ left: `${8 + i * 11}%`, top: "10%" }}
                  initial={{ opacity: 0, y: 0, scale: 0 }}
                  animate={{
                    opacity: [0, 1, 1, 0],
                    y: [-10, -100],
                    scale: [0, 1.1, 1, 0.3],
                    rotate: [0, i % 2 === 0 ? 40 : -40],
                  }}
                  transition={{ delay: i * 0.08, duration: 1.7 }}
                >
                  {item}
                </motion.div>
              ))}

            {/* Food icon */}
            <motion.div
              className="text-6xl mb-2"
              animate={
                result.success
                  ? { scale: [1, 1.25, 1, 1.15, 1], rotate: [0, -8, 8, -4, 0] }
                  : {}
              }
              transition={{ duration: 0.9 }}
            >
              {result.success ? stageIcon : "🥺"}
            </motion.div>

            {/* Message */}
            <h2
              className="text-2xl font-black mb-1.5"
              style={{ color: result.success ? "#92400E" : "#C05621" }}
            >
              {result.message}
            </h2>
            <p
              className="text-sm font-bold mb-4 leading-relaxed"
              style={{ color: result.success ? "#276749" : "#C05621" }}
            >
              {result.subMessage}
            </p>

            {/* Buttons */}
            {result.success ? (
              <div className="flex flex-col gap-2">
                {/* Primary: go cook for real! */}
                <motion.button
                  whileTap={{ scale: 0.94 }}
                  onClick={onRealCooking}
                  className="w-full py-4 rounded-2xl text-white font-black text-lg shadow-lg"
                  style={{ background: "linear-gradient(135deg,#48BB78,#276749)" }}
                >
                  🍳 ほんとうに作ってみよう！
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.94 }}
                  onClick={onStageSelect}
                  className="w-full py-2.5 rounded-2xl font-black text-sm"
                  style={{ background: "#F7FAFC", color: "#4A5568", border: "2px solid #E2E8F0" }}
                >
                  あとで作る（ステージせんたく）
                </motion.button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <motion.button
                  whileTap={{ scale: 0.94 }}
                  onClick={onRetry}
                  className="w-full py-3.5 rounded-2xl text-white font-black text-lg shadow-lg"
                  style={{ background: "linear-gradient(135deg,#FC8181,#F6AD55)" }}
                >
                  もういちど！
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.94 }}
                  onClick={onStageSelect}
                  className="w-full py-2.5 rounded-2xl font-black text-sm"
                  style={{ background: "#F7FAFC", color: "#4A5568", border: "2px solid #E2E8F0" }}
                >
                  ステージせんたくにもどる
                </motion.button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
