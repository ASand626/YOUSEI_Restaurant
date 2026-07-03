"use client";
import { motion } from "framer-motion";
import { ALL_STAGES, LEVELS, isLevelAccessible, isLevelComplete } from "@/lib/stages";

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
  gameClearedIds: Set<number>;
  cookingDoneIds: Set<number>;
  totalCoins: number;
  onSelectStage: (stageId: number) => void;
  onRealCooking: (stageId: number) => void;
}

export default function StageSelectScreen({
  gameClearedIds,
  cookingDoneIds,
  totalCoins,
  onSelectStage,
  onRealCooking,
}: Props) {
  const stagesByLevel = LEVELS.map((lvl) => ({
    level: lvl,
    stages: ALL_STAGES.filter((s) => s.level === lvl.id),
  }));

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

      <div className="px-4 pt-4 flex flex-col gap-6 max-w-sm mx-auto">
        {stagesByLevel.map(({ level, stages }) => {
          const accessible = isLevelAccessible(level.id, cookingDoneIds);
          const complete = isLevelComplete(level.id, cookingDoneIds);
          const doneCount = stages.filter((s) => cookingDoneIds.has(s.id)).length;

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
                {!accessible ? (
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

              {/* Stage cards */}
              <div className="grid grid-cols-3 gap-2.5">
                {stages.map((stage) => {
                  const gameCleared = gameClearedIds.has(stage.id);
                  const cookingDone = cookingDoneIds.has(stage.id);
                  const cookingAvailable = gameCleared && !cookingDone;

                  const canTapGame = accessible;

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
                          opacity: accessible ? 1 : 0.45,
                          cursor: canTapGame ? "pointer" : "default",
                        }}
                      >
                        <span className="text-2xl leading-none">
                          {accessible ? stage.icon : "🔒"}
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
    </main>
  );
}
