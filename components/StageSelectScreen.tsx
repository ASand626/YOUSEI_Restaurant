"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ALL_STAGES,
  LEVELS,
  isLevelUnlocked,
  isLevelComplete,
  canBuyLevel,
} from "@/lib/stages";

const LEVEL_BG: Record<string, string> = {
  green:  "linear-gradient(135deg,#F0FFF4,#C6F6D5)",
  blue:   "linear-gradient(135deg,#EBF8FF,#BEE3F8)",
  orange: "linear-gradient(135deg,#FFFAF0,#FEEBC8)",
  rose:   "linear-gradient(135deg,#FFF5F5,#FED7D7)",
};

const LEVEL_BORDER: Record<string, string> = {
  green:  "#68D391",
  blue:   "#63B3ED",
  orange: "#F6AD55",
  rose:   "#FC8181",
};

const LEVEL_TEXT: Record<string, string> = {
  green:  "#276749",
  blue:   "#1A365D",
  orange: "#7B341E",
  rose:   "#742A2A",
};

interface Props {
  username: string;
  gameClearedIds: Set<number>;
  cookingDoneIds: Set<number>;
  totalCoins: number;
  unlockedLevelIds: Set<number>;
  onSelectStage: (stageId: number) => void;
  onRealCooking: (stageId: number) => void;
  onLogout: () => void;
  onUnlockLevel: (levelId: number) => boolean;
}

export default function StageSelectScreen({
  username,
  gameClearedIds,
  cookingDoneIds,
  totalCoins,
  unlockedLevelIds,
  onSelectStage,
  onRealCooking,
  onLogout,
  onUnlockLevel,
}: Props) {
  const [celebration, setCelebration] = useState<{ icon: string; name: string } | null>(null);

  const stagesByLevel = LEVELS.map((lvl) => ({
    level: lvl,
    stages: ALL_STAGES.filter((s) => s.level === lvl.id),
  }));

  const handleBuy = (levelId: number, toolIcon: string, toolName: string) => {
    if (onUnlockLevel(levelId)) {
      setCelebration({ icon: toolIcon, name: toolName });
    }
  };

  return (
    <main className="min-h-screen pb-10">
      {/* Sticky header */}
      <div
        className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 shadow-sm"
        style={{ background: "linear-gradient(135deg,#FFF9F0,#F0EEFF)" }}
      >
        <h1 className="text-xl font-black text-purple-700">🍳 ようせいレストラン</h1>
        <div className="flex items-center gap-1.5 bg-yellow-100 rounded-xl px-3 py-1.5 border-2 border-yellow-300">
          <span>💰</span>
          <span className="font-black text-yellow-800 text-sm">{totalCoins}</span>
        </div>
      </div>

      {/* User bar */}
      <div className="flex items-center justify-between px-4 pt-3 max-w-sm mx-auto">
        <span className="text-xs font-bold text-purple-500">🧑 {username}</span>
        <button
          onClick={onLogout}
          className="text-[11px] font-bold text-gray-400 hover:text-gray-500"
        >
          なまえを きりかえる
        </button>
      </div>

      <div className="px-4 pt-4 flex flex-col gap-6 max-w-sm mx-auto">
        {stagesByLevel.map(({ level, stages }) => {
          const unlocked = isLevelUnlocked(level.id, unlockedLevelIds);
          const complete = isLevelComplete(level.id, cookingDoneIds);
          const doneCount = stages.filter((s) => cookingDoneIds.has(s.id)).length;
          const canBuy = !unlocked && canBuyLevel(level.id, unlockedLevelIds, totalCoins);
          const prevUnlocked = isLevelUnlocked(level.id - 1, unlockedLevelIds);

          return (
            <section key={level.id}>
              {/* Level header */}
              <div
                className="flex items-center gap-2 rounded-2xl px-3 py-2.5 mb-3 border-2"
                style={{
                  background: LEVEL_BG[level.color],
                  borderColor: LEVEL_BORDER[level.color],
                }}
              >
                <span className="text-2xl">{level.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-base leading-tight" style={{ color: LEVEL_TEXT[level.color] }}>
                    レベル {level.id}：{level.name}
                  </p>
                  <p className="text-xs opacity-70" style={{ color: LEVEL_TEXT[level.color] }}>
                    {level.description}
                  </p>
                </div>
                {!unlocked ? (
                  <span className="text-xl shrink-0">🔒</span>
                ) : (
                  <span
                    className="text-[10px] font-black shrink-0 px-2 py-1 rounded-lg"
                    style={{ color: LEVEL_TEXT[level.color], background: "rgba(255,255,255,0.6)" }}
                  >
                    {complete ? "✅ クリア！" : `${doneCount}/${stages.length}`}
                  </span>
                )}
              </div>

              {/* Tool shop panel for locked levels */}
              {!unlocked && level.toolName && (
                <div
                  className="rounded-2xl p-3 mb-3 flex items-center gap-3"
                  style={{ background: "#F7FAFC", border: "2px dashed #CBD5E0" }}
                >
                  <span className="text-3xl shrink-0">{level.toolIcon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-black text-gray-600">{level.toolName}</p>
                    <p className="text-[10px] text-gray-400">
                      {prevUnlocked
                        ? `💰${level.unlockCost}コインで てにはいるよ！`
                        : "まえの どうぐを さきに てにいれてね"}
                    </p>
                  </div>
                  {prevUnlocked && (
                    <motion.button
                      whileTap={canBuy ? { scale: 0.94 } : {}}
                      onClick={() => canBuy && handleBuy(level.id, level.toolIcon!, level.toolName!)}
                      disabled={!canBuy}
                      className="shrink-0 py-2 px-3 rounded-xl text-white font-black text-[11px] shadow"
                      style={{
                        background: canBuy
                          ? "linear-gradient(135deg,#48BB78,#276749)"
                          : "#CBD5E0",
                        cursor: canBuy ? "pointer" : "not-allowed",
                      }}
                    >
                      てにいれる！
                    </motion.button>
                  )}
                </div>
              )}

              {/* Stage cards */}
              <div className="grid grid-cols-3 gap-2.5">
                {stages.map((stage) => {
                  const gameCleared = gameClearedIds.has(stage.id);
                  const cookingDone = cookingDoneIds.has(stage.id);
                  const cookingAvailable = gameCleared && !cookingDone;

                  const canTapGame = unlocked;

                  return (
                    <div key={stage.id} className="flex flex-col gap-1.5">
                      {/* Game card */}
                      <motion.button
                        whileTap={canTapGame ? { scale: 0.93 } : {}}
                        onClick={() => canTapGame && onSelectStage(stage.id)}
                        className="flex flex-col items-center gap-1 rounded-2xl p-2.5 transition-all"
                        style={{
                          background: cookingDone
                            ? "linear-gradient(135deg,#C6F6D5,#9AE6B4)"
                            : canTapGame
                            ? LEVEL_BG[level.color]
                            : "#F7FAFC",
                          border: `2.5px solid ${
                            cookingDone
                              ? "#68D391"
                              : canTapGame
                              ? LEVEL_BORDER[level.color]
                              : "#E2E8F0"
                          }`,
                          opacity: unlocked ? 1 : 0.45,
                          cursor: canTapGame ? "pointer" : "default",
                        }}
                      >
                        <span className="text-2xl leading-none">
                          {unlocked ? stage.icon : "🔒"}
                        </span>
                        <span
                          className="text-[9px] font-bold leading-tight text-center"
                          style={{
                            color: cookingDone
                              ? "#276749"
                              : canTapGame
                              ? LEVEL_TEXT[level.color]
                              : "#A0AEC0",
                          }}
                        >
                          {stage.title.length > 6 ? stage.title.slice(0, 6) + "…" : stage.title}
                        </span>

                        {/* Status badges */}
                        <div className="flex gap-0.5 mt-0.5">
                          {gameCleared && <span className="text-xs">🎮✅</span>}
                          {cookingDone && <span className="text-xs">🍳✅</span>}
                        </div>
                      </motion.button>

                      {/* "りょうりしよう！" button when cooking is available */}
                      {cookingAvailable && (
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => onRealCooking(stage.id)}
                          className="w-full py-1.5 rounded-xl text-white font-black text-[10px] shadow"
                          style={{ background: "linear-gradient(135deg,#48BB78,#276749)" }}
                        >
                          🍳 りょうりしよう！
                        </motion.button>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}

        {/* Legend */}
        <div className="flex gap-3 justify-center text-[10px] text-gray-400 pb-2 flex-wrap">
          <span>🎮✅ ゲームクリア</span>
          <span>🍳✅ りょうりかくにん</span>
          <span>🔒 ロック中</span>
        </div>
      </div>

      {/* Unlock celebration */}
      <AnimatePresence>
        {celebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCelebration(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
            style={{ backgroundColor: "rgba(80,40,100,0.55)" }}
          >
            <motion.div
              initial={{ scale: 0.4, opacity: 0, y: 60 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{ type: "spring", stiffness: 340, damping: 22 }}
              className="rounded-3xl p-7 max-w-xs w-full text-center shadow-2xl"
              style={{
                background: "linear-gradient(135deg,#FFFBEA,#F0FFF4)",
                borderWidth: 4,
                borderStyle: "solid",
                borderColor: "#F6E05E",
              }}
            >
              <motion.div
                className="text-6xl mb-2"
                animate={{ scale: [1, 1.25, 1, 1.15, 1], rotate: [0, -8, 8, -4, 0] }}
                transition={{ duration: 0.9 }}
              >
                {celebration.icon}
              </motion.div>
              <h2 className="text-xl font-black mb-1.5 text-amber-800">
                🎉 あたらしい どうぐを てにいれた！
              </h2>
              <p className="text-base font-black text-green-700 mb-4">{celebration.name}</p>
              <motion.button
                whileTap={{ scale: 0.94 }}
                onClick={() => setCelebration(null)}
                className="w-full py-3 rounded-2xl text-white font-black text-base shadow-lg"
                style={{ background: "linear-gradient(135deg,#48BB78,#276749)" }}
              >
                やったー！
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
