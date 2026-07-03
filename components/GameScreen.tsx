"use client";

import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion, AnimatePresence } from "framer-motion";

import { CARD_DEFS } from "@/lib/gameData";
import { StageDefinition, RealStep } from "@/lib/stages";
import { stepCardId, validateGameOrder, ValidationResult } from "@/lib/recipeEngine";
import FairyCharacter, { FairyState } from "@/components/FairyCharacter";
import ResultOverlay from "@/components/ResultOverlay";

// ── Deterministic shuffle (no Math.random — must match on server & client) ────
function shuffledIndices(count: number, seed: number): number[] {
  const arr = Array.from({ length: count }, (_, i) => i);
  let s = seed * 9301 + 49297;
  const rand = () => {
    s = (s * 9301 + 49297) % 233280;
    return Math.abs(s) / 233280;
  };
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ── Step card visual ────────────────────────────────────────────────────────────
function StepPill({ step, isOverlay = false }: { step: RealStep; isOverlay?: boolean }) {
  const def = CARD_DEFS[step.card];
  return (
    <div
      className={`flex items-center gap-2 rounded-2xl px-3 py-2 shadow ${
        isOverlay ? "shadow-2xl scale-105" : ""
      }`}
      style={{ backgroundColor: def.bgColor, borderWidth: 3, borderStyle: "solid", borderColor: def.borderColor }}
    >
      <span className="text-2xl leading-none shrink-0">{def.emoji}</span>
      {step.ingredients && step.ingredients.length > 0 && (
        <span className="text-lg leading-none shrink-0">
          {step.ingredients.map((ing) => ing.emoji).join("")}
        </span>
      )}
      <span className="text-sm font-black leading-snug" style={{ color: def.textColor }}>
        {step.gameLabel}
      </span>
    </div>
  );
}

// ── Pool card (draggable, not sortable) ─────────────────────────────────────────
function PoolCard({ id, step }: { id: string; step: RealStep }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `pool-${id}`,
    data: { source: "pool", cardId: id },
  });

  return (
    <div
      ref={setNodeRef}
      style={
        transform
          ? { transform: `translate3d(${transform.x}px,${transform.y}px,0)` }
          : undefined
      }
      className={`cursor-grab active:cursor-grabbing touch-none transition-opacity ${
        isDragging ? "opacity-0" : "opacity-100"
      }`}
      {...listeners}
      {...attributes}
    >
      <StepPill step={step} />
    </div>
  );
}

// ── Sortable zone card ───────────────────────────────────────────────────────────
function ZoneCard({
  id,
  step,
  index,
  onRemove,
}: {
  id: string;
  step: RealStep;
  index: number;
  onRemove: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id, data: { source: "zone", cardId: id } });

  return (
    <motion.div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.25 : 1 }}
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: isDragging ? 0.25 : 1, x: 0 }}
      exit={{ opacity: 0, x: 20, transition: { duration: 0.12 } }}
      className="flex items-center gap-2 touch-none"
    >
      <span className="text-xs font-black text-purple-400 w-5 text-right shrink-0">
        {index + 1}
      </span>
      <div {...listeners} {...attributes} className="cursor-grab active:cursor-grabbing">
        <StepPill step={step} />
      </div>
      <button
        onPointerDown={(e) => e.stopPropagation()}
        onClick={() => onRemove(id)}
        className="w-7 h-7 rounded-full bg-red-300 hover:bg-red-400 text-white font-black
                   text-sm flex items-center justify-center shadow shrink-0 transition-colors"
      >
        ×
      </button>
    </motion.div>
  );
}

// ── Drop zone ──────────────────────────────────────────────────────────────────
function RecipeDropZone({ children, isEmpty }: { children: React.ReactNode; isEmpty: boolean }) {
  const { setNodeRef, isOver } = useDroppable({ id: "recipe-zone" });

  return (
    <div
      ref={setNodeRef}
      className="min-h-32 rounded-2xl p-3 flex flex-col gap-2 transition-colors"
      style={{
        borderWidth: 3,
        borderStyle: "dashed",
        borderColor: isOver ? "#9F7AEA" : "#D6BCFA",
        backgroundColor: isOver ? "#F3E8FF" : "#FAF5FF",
      }}
    >
      {isEmpty ? (
        <div className="flex flex-col items-center justify-center flex-1 py-4 gap-1">
          <span className="text-2xl">👇</span>
          <p className="text-purple-400 font-bold text-xs text-center leading-snug">
            ここにてじゅんカードをドラッグしてね！
          </p>
        </div>
      ) : (
        children
      )}
    </div>
  );
}

// ── Game Screen ────────────────────────────────────────────────────────────────
interface Props {
  stage: StageDefinition;
  onGameClear: () => void;
  onRealCooking: () => void;
  onStageSelect: () => void;
}

export default function GameScreen({
  stage,
  onGameClear,
  onRealCooking,
  onStageSelect,
}: Props) {
  const steps = stage.realRecipe.steps;

  const [recipeCards, setRecipeCards] = useState<string[]>([]);
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [fairyState, setFairyState] = useState<FairyState>("idle");
  const [isRunning, setIsRunning] = useState(false);
  const [execStep, setExecStep] = useState<number | null>(null);
  const [completedOnce, setCompletedOnce] = useState(false);

  const poolOrder = shuffledIndices(steps.length, stage.id).map((i) => stepCardId(i));
  const poolIds = poolOrder.filter((id) => !recipeCards.includes(id));

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  // ── Drag ────────────────────────────────────────────────────────────────────
  const handleDragStart = ({ active }: DragStartEvent) => {
    const d = active.data.current;
    if (d) setActiveCardId(d.cardId as string);
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveCardId(null);
    if (!over) return;
    const d = active.data.current;
    if (!d) return;

    if (d.source === "pool") {
      const overRecipe =
        over.id === "recipe-zone" || recipeCards.includes(over.id as string);
      if (overRecipe) {
        setRecipeCards((p) => [...p, d.cardId as string]);
      }
    } else if (d.source === "zone" && active.id !== over.id) {
      setRecipeCards((p) => {
        const from = p.indexOf(active.id as string);
        const to = p.indexOf(over.id as string);
        return from >= 0 && to >= 0 ? arrayMove(p, from, to) : p;
      });
    }
  };

  const removeCard = (id: string) => setRecipeCards((p) => p.filter((c) => c !== id));

  const stepOf = (cardId: string) => steps[Number(cardId.replace("step-", ""))];

  // ── Execution ───────────────────────────────────────────────────────────────
  const runRecipe = async () => {
    if (isRunning || recipeCards.length < steps.length) return;
    setIsRunning(true);
    setFairyState("thinking");

    for (let i = 1; i <= recipeCards.length; i++) {
      setExecStep(i);
      await delay(380);
    }
    setExecStep(null);

    const validation = validateGameOrder(recipeCards, stage);

    if (validation.success) {
      setFairyState("happy");
      if (!completedOnce) {
        setCompletedOnce(true);
        onGameClear();
      }
    } else {
      setFairyState("thinking");
    }

    await delay(200);
    setResult(validation);
    setIsRunning(false);
  };

  const retry = () => {
    setResult(null);
    setRecipeCards([]);
    setFairyState("idle");
  };

  const fairySpeech: Record<FairyState, string> = {
    idle: `${steps.length}こ の てじゅんカードを、ただしい じゅんばんに ならべてね！`,
    thinking: execStep
      ? `ステップ${execStep}：${stepOf(recipeCards[execStep - 1])?.gameLabel ?? ""}…`
      : "うーん、考えてる…✨",
    happy: "やったー！おいしくできたよ！🎉",
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-start py-3 px-3">
      <div className="w-full max-w-sm flex flex-col gap-3">

        {/* Back button + title */}
        <div className="flex items-center gap-2">
          <button
            onClick={onStageSelect}
            className="text-xs font-bold text-purple-500 hover:text-purple-700 flex items-center gap-1"
          >
            ← もどる
          </button>
          <h1 className="text-sm font-black text-purple-700 ml-1">
            {stage.title}
          </h1>
        </div>

        {/* Order panel */}
        <div
          className="rounded-2xl p-3 flex items-center gap-3 shadow"
          style={{ background: "linear-gradient(135deg,#FFF3D6,#FFE8A0)" }}
        >
          <span className="text-4xl shrink-0">{stage.icon}</span>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-black text-amber-600 uppercase tracking-wide">ちゅうもん</p>
            <p className="text-sm font-black text-amber-900 leading-snug">{stage.description}</p>
          </div>
        </div>

        {/* Fairy */}
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            <FairyCharacter state={fairyState} />
          </div>
          <div className="flex-1 bg-white rounded-2xl rounded-tl-none p-3 shadow border-2 border-purple-100">
            <p className="text-sm font-bold text-purple-700 leading-relaxed">
              {fairySpeech[fairyState]}
            </p>
          </div>
        </div>

        {/* DnD area */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          {/* Recipe */}
          <div>
            <p className="text-[11px] font-black text-purple-500 mb-1.5">
              📋 てじゅん（ならべよう）
            </p>
            <div className="relative">
              <RecipeDropZone isEmpty={recipeCards.length === 0}>
                <SortableContext items={recipeCards} strategy={verticalListSortingStrategy}>
                  <AnimatePresence>
                    {recipeCards.map((id, i) => (
                      <ZoneCard
                        key={id}
                        id={id}
                        step={stepOf(id)}
                        index={i}
                        onRemove={removeCard}
                      />
                    ))}
                  </AnimatePresence>
                </SortableContext>
              </RecipeDropZone>

              {/* Execution overlay */}
              <AnimatePresence>
                {execStep !== null && (
                  <motion.div
                    className="absolute inset-0 bg-white/80 rounded-2xl flex flex-col items-center justify-center gap-2 z-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <motion.span
                      className="text-4xl"
                      animate={{ scale: [1, 1.3, 1], rotate: [0, 20, -20, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                    >
                      ✨
                    </motion.span>
                    <p className="text-sm font-black text-purple-600">
                      ステップ {execStep} / {recipeCards.length}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Inventory */}
          <div>
            <p className="text-[11px] font-black text-gray-500 mb-1.5">
              🎴 てじゅんカード（ドラッグしてね）
            </p>
            <div className="flex flex-col gap-2">
              {poolIds.map((id) => (
                <PoolCard key={id} id={id} step={stepOf(id)} />
              ))}
            </div>
          </div>

          <DragOverlay dropAnimation={null}>
            {activeCardId && <StepPill step={stepOf(activeCardId)} isOverlay />}
          </DragOverlay>
        </DndContext>

        {/* Run button */}
        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={runRecipe}
          disabled={isRunning || recipeCards.length < steps.length}
          className="w-full py-4 rounded-2xl text-white text-xl font-black shadow-lg"
          style={{
            background:
              recipeCards.length < steps.length || isRunning
                ? "#CBD5E0"
                : "linear-gradient(135deg,#48BB78,#38A169)",
            cursor: recipeCards.length < steps.length || isRunning ? "not-allowed" : "pointer",
          }}
        >
          {isRunning ? "⏳ じっこうちゅう…" : "▶ じっこう！"}
        </motion.button>

        {/* Reset */}
        {recipeCards.length > 0 && !isRunning && !result && (
          <button
            onClick={retry}
            className="text-xs text-gray-400 hover:text-gray-500 text-center font-medium"
          >
            リセット
          </button>
        )}
      </div>

      {/* Result */}
      <ResultOverlay
        result={result}
        stageIcon={stage.icon}
        onRetry={retry}
        onRealCooking={onRealCooking}
        onStageSelect={onStageSelect}
      />
    </main>
  );
}

function delay(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}
