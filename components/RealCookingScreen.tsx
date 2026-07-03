"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StageDefinition, RealStep } from "@/lib/stages";
import { CARD_DEFS } from "@/lib/gameData";

type Phase = "ingredients" | "steps" | "done";

interface Props {
  stage: StageDefinition;
  onDone: () => void;
  onBack: () => void;
}

// ── Timer component ───────────────────────────────────────────────────────────
function CountdownTimer({
  seconds,
  onFinish,
}: {
  seconds: number;
  onFinish: () => void;
}) {
  const [remaining, setRemaining] = useState(seconds);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running && remaining > 0) {
      intervalRef.current = setInterval(() => {
        setRemaining((r) => {
          if (r <= 1) {
            clearInterval(intervalRef.current!);
            setRunning(false);
            onFinish();
            return 0;
          }
          return r - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current!);
  }, [running]);

  const pct = ((seconds - remaining) / seconds) * 100;
  const min = Math.floor(remaining / 60);
  const sec = remaining % 60;

  return (
    <div className="flex flex-col items-center gap-2 my-2">
      {!running && remaining === seconds && (
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setRunning(true)}
          className="px-5 py-2 rounded-2xl text-white font-black text-sm shadow"
          style={{ background: "linear-gradient(135deg,#4299E1,#2B6CB0)" }}
        >
          ⏱ タイマースタート！
        </motion.button>
      )}
      {(running || remaining < seconds) && (
        <>
          <div className="relative w-24 h-24">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="44" fill="none" stroke="#EDF2F7" strokeWidth="10" />
              <circle
                cx="50"
                cy="50"
                r="44"
                fill="none"
                stroke={remaining === 0 ? "#68D391" : "#4299E1"}
                strokeWidth="10"
                strokeDasharray={`${2 * Math.PI * 44}`}
                strokeDashoffset={`${2 * Math.PI * 44 * (1 - pct / 100)}`}
                strokeLinecap="round"
                style={{ transition: "stroke-dashoffset 0.9s linear" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-black text-blue-700">
                {min > 0 ? `${min}:${sec.toString().padStart(2, "0")}` : `${sec}`}
              </span>
              <span className="text-[9px] text-gray-500">
                {remaining === 0 ? "おわり！" : "びょう"}
              </span>
            </div>
          </div>
          {remaining === 0 && (
            <p className="text-green-600 font-black text-sm">そろそろできたよ！✅</p>
          )}
        </>
      )}
    </div>
  );
}

// ── Ingredient list ───────────────────────────────────────────────────────────
function IngredientsPhase({
  stage,
  onNext,
}: {
  stage: StageDefinition;
  onNext: () => void;
}) {
  const r = stage.realRecipe!;
  return (
    <div className="flex flex-col gap-4">
      <div className="text-center">
        <span className="text-5xl">{stage.icon}</span>
        <h2 className="text-xl font-black text-gray-800 mt-1">{stage.title}</h2>
        <div className="flex gap-3 justify-center mt-1 text-xs text-gray-500">
          <span>⏱ {r.prepTime}</span>
          <span>👤 {r.servings}</span>
        </div>
      </div>

      <div className="rounded-2xl p-4 shadow-sm" style={{ background: "#FFFBF0", border: "2px solid #FBD38D" }}>
        <p className="text-xs font-black text-amber-700 mb-2">🛒 ざいりょう</p>
        <ul className="flex flex-col gap-1.5">
          {r.ingredients.map((ing, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
              <span className="text-xl w-7 text-center">{ing.emoji}</span>
              <span className="font-bold flex-1">{ing.name}</span>
              <span className="text-gray-500 text-xs">{ing.amount}</span>
            </li>
          ))}
        </ul>
      </div>

      {r.parentNote && (
        <div className="rounded-2xl p-3" style={{ background: "#FFF5F5", border: "2px solid #FC8181" }}>
          <p className="text-xs font-bold text-red-600">
            ⚠️ おうちのひとへ：{r.parentNote}
          </p>
        </div>
      )}

      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={onNext}
        className="w-full py-4 rounded-2xl text-white font-black text-xl shadow-lg"
        style={{ background: "linear-gradient(135deg,#48BB78,#38A169)" }}
      >
        ざいりょうがそろった！はじめよう →
      </motion.button>
    </div>
  );
}

// ── Single step view ──────────────────────────────────────────────────────────
function StepView({
  step,
  stepNum,
  totalSteps,
  onNext,
}: {
  step: RealStep;
  stepNum: number;
  totalSteps: number;
  onNext: () => void;
}) {
  const def = CARD_DEFS[step.card];
  const isLast = stepNum === totalSteps;
  const [timerDone, setTimerDone] = useState(false);

  return (
    <motion.div
      key={stepNum}
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col gap-4"
    >
      {/* Progress */}
      <div className="flex gap-1.5 justify-center">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className="h-2 rounded-full transition-all"
            style={{
              width: i + 1 === stepNum ? 24 : 12,
              background: i + 1 <= stepNum ? def.borderColor : "#E2E8F0",
            }}
          />
        ))}
      </div>

      {/* Step number */}
      <div className="text-center">
        <span className="text-[11px] font-black text-gray-400">
          ステップ {stepNum} / {totalSteps}
        </span>
      </div>

      {/* Card icon */}
      <div
        className="flex flex-col items-center justify-center rounded-3xl mx-auto py-5 px-8 shadow-md"
        style={{ backgroundColor: def.bgColor, borderWidth: 3, borderStyle: "solid", borderColor: def.borderColor }}
      >
        <span className="text-6xl leading-none">{def.emoji}</span>
        <span className="text-lg font-black mt-2" style={{ color: def.textColor }}>
          {def.name}
        </span>
      </div>

      {/* Instruction */}
      <div className="rounded-2xl p-4 shadow-sm bg-white border-2 border-gray-100">
        <h3 className="text-base font-black text-gray-800 mb-1.5">{step.title}</h3>
        <p className="text-sm text-gray-600 leading-relaxed">{step.detail}</p>
      </div>

      {/* Safety note */}
      {step.safetyNote && (
        <div className="rounded-xl p-3" style={{ background: "#FFF5F5", border: "2px solid #FC8181" }}>
          <p className="text-xs font-bold text-red-600">⚠️ {step.safetyNote}</p>
        </div>
      )}

      {/* Timer */}
      {step.timer && (
        <CountdownTimer seconds={step.timer} onFinish={() => setTimerDone(true)} />
      )}

      {/* Next button */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={onNext}
        className="w-full py-4 rounded-2xl text-white font-black text-xl shadow-lg"
        style={{
          background: isLast
            ? "linear-gradient(135deg,#F6E05E,#68D391)"
            : "linear-gradient(135deg,#4299E1,#3182CE)",
        }}
      >
        {isLast ? "できた！🎉" : "できた！つぎへ →"}
      </motion.button>
    </motion.div>
  );
}

// ── Done view ─────────────────────────────────────────────────────────────────
function DoneView({ stage, onConfirm }: { stage: StageDefinition; onConfirm: () => void }) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="flex flex-col items-center gap-5 py-4 text-center"
    >
      <motion.div
        className="text-8xl"
        animate={{ scale: [1, 1.15, 1], rotate: [0, -10, 10, 0] }}
        transition={{ duration: 1, repeat: 2 }}
      >
        {stage.icon}
      </motion.div>
      <div>
        <h2 className="text-2xl font-black text-green-700">{stage.title}</h2>
        <p className="text-base font-bold text-gray-600 mt-1">できあがり！🎉</p>
      </div>
      <p className="text-sm text-gray-500 leading-relaxed">
        おいしくできたかな？
        <br />
        おうちのひとにかくにんしてもらおう！
      </p>
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={onConfirm}
        className="w-full py-4 rounded-2xl text-white font-black text-lg shadow-lg"
        style={{ background: "linear-gradient(135deg,#F6E05E,#ED8936)" }}
      >
        おうちのひとをよぼう！ →
      </motion.button>
    </motion.div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function RealCookingScreen({ stage, onDone, onBack }: Props) {
  const [phase, setPhase] = useState<Phase>("ingredients");
  const [stepIndex, setStepIndex] = useState(0);

  const recipe = stage.realRecipe!;
  const steps = recipe.steps;

  const handleNextStep = () => {
    if (stepIndex + 1 < steps.length) {
      setStepIndex((i) => i + 1);
    } else {
      setPhase("done");
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-start py-3 px-4">
      <div className="w-full max-w-sm flex flex-col gap-3">
        {/* Header */}
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="text-xs font-bold text-green-600 hover:text-green-800"
          >
            ← ゲームにもどる
          </button>
          <span
            className="ml-auto text-xs font-black px-2 py-1 rounded-xl text-white"
            style={{ background: "linear-gradient(135deg,#48BB78,#2F855A)" }}
          >
            🍳 ほんとうのりょうり
          </span>
        </div>

        {/* Phase content */}
        <AnimatePresence mode="wait">
          {phase === "ingredients" && (
            <motion.div key="ingredients" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <IngredientsPhase stage={stage} onNext={() => setPhase("steps")} />
            </motion.div>
          )}

          {phase === "steps" && (
            <motion.div key={`step-${stepIndex}`}>
              <StepView
                step={steps[stepIndex]}
                stepNum={stepIndex + 1}
                totalSteps={steps.length}
                onNext={handleNextStep}
              />
            </motion.div>
          )}

          {phase === "done" && (
            <motion.div key="done">
              <DoneView stage={stage} onConfirm={onDone} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
