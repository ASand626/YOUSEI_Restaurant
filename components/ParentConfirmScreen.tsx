"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StageDefinition } from "@/lib/stages";

interface Props {
  stage: StageDefinition;
  didLevelUp: boolean;
  onConfirmed: () => void;
  onSkip: () => void;
}

const CELEBRATION = ["🎉", "⭐", "✨", "🌟", "🎊", "💫", "🏆", "🥇"];

export default function ParentConfirmScreen({ stage, didLevelUp, onConfirmed, onSkip }: Props) {
  const [confirmed, setConfirmed] = useState(false);

  const handleConfirm = () => {
    setConfirmed(true);
    setTimeout(onConfirmed, 2200);
  };

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-5 py-8"
      style={{ background: "linear-gradient(135deg,#FFF9F0,#F0FFF4)" }}
    >
      <div className="w-full max-w-sm flex flex-col gap-5">
        <AnimatePresence mode="wait">
          {!confirmed ? (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col gap-5"
            >
              {/* Parent label */}
              <div
                className="text-center rounded-2xl py-3 px-4"
                style={{ background: "#FEF3C7", border: "2px solid #F6AD55" }}
              >
                <p className="text-xs font-black text-amber-700 uppercase tracking-wider">
                  👨‍👩‍👧 おうちのひとへ
                </p>
              </div>

              {/* Stage icon + message */}
              <div className="text-center">
                <span className="text-7xl">{stage.icon}</span>
                <h2 className="text-2xl font-black text-gray-800 mt-3">
                  {stage.title}を<br />作りました！
                </h2>
                <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                  ゲームで手じゅんをおぼえて、
                  <br />
                  じっさいにチャレンジしました。
                  <br />
                  おいしくできていたら
                  <br />
                  ボタンをおしてください🙏
                </p>
              </div>

              {/* Confirm button — placed prominently */}
              <motion.button
                whileTap={{ scale: 0.93 }}
                onClick={handleConfirm}
                className="w-full py-5 rounded-2xl text-white font-black text-xl shadow-xl"
                style={{ background: "linear-gradient(135deg,#48BB78,#276749)" }}
              >
                🍳 おいしかった！<br />
                <span className="text-base font-bold">（ここをおしてね）</span>
              </motion.button>

              {/* Skip — small, for "haven't cooked yet" */}
              <button
                onClick={onSkip}
                className="text-xs text-gray-400 hover:text-gray-500 text-center mt-1"
              >
                まだりょうりしてない（あとでかくにん）
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="celebration"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 280, damping: 18 }}
              className="flex flex-col items-center gap-5 text-center py-6"
            >
              {/* Confetti */}
              {CELEBRATION.map((c, i) => (
                <motion.div
                  key={i}
                  className="absolute text-3xl pointer-events-none"
                  style={{ left: `${5 + i * 12}%`, top: "15%" }}
                  initial={{ opacity: 0, y: 0, scale: 0 }}
                  animate={{
                    opacity: [0, 1, 1, 0],
                    y: -200,
                    scale: [0, 1.2, 1, 0],
                    rotate: [0, (i % 2 === 0 ? 60 : -60)],
                  }}
                  transition={{ delay: i * 0.1, duration: 2 }}
                >
                  {c}
                </motion.div>
              ))}

              <motion.div
                className="text-8xl"
                animate={{ scale: [1, 1.2, 1], rotate: [0, -10, 10, 0] }}
                transition={{ duration: 0.8, repeat: 2 }}
              >
                {stage.icon}
              </motion.div>

              <div>
                <h2 className="text-3xl font-black text-green-700">やったー！🎉</h2>
                <p className="text-base font-bold text-green-600 mt-1">
                  {stage.title}マスター！
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  {didLevelUp
                    ? "🎉 レベルアップ！つぎのレベルがかいほうされたよ！"
                    : "また ちがう レシピにも ちょうせんしてみよう！"}
                </p>
              </div>

              <motion.div
                className="flex items-center gap-2 rounded-2xl py-3 px-6"
                style={{ background: "#FEF3C7" }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
              >
                <span className="text-3xl">💰</span>
                <span className="text-xl font-black text-yellow-700">
                  +{stage.coinReward} コイン！
                </span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
