"use client";

import { useState, useEffect } from "react";
import { getStage, isLevelComplete } from "@/lib/stages";
import StageSelectScreen from "@/components/StageSelectScreen";
import GameScreen from "@/components/GameScreen";
import RealCookingScreen from "@/components/RealCookingScreen";
import ParentConfirmScreen from "@/components/ParentConfirmScreen";

// ── Persistence keys (v2 — level-based redesign) ───────────────────────────────
const KEY_GAME_CLEARED  = "fr-game-cleared-v2";
const KEY_COOKING_DONE  = "fr-cooking-done-v2";
const KEY_COINS         = "fr-coins-v2";

// ── Screen types ──────────────────────────────────────────────────────────────
type Screen =
  | "stageSelect"
  | "gamePlaying"
  | "realCooking"
  | "parentConfirm";

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [screen,        setScreen]        = useState<Screen>("stageSelect");
  const [stageId,       setStageId]       = useState(1);
  const [gameClearedIds, setGameClearedIds] = useState<Set<number>>(new Set());
  const [cookingDoneIds, setCookingDoneIds] = useState<Set<number>>(new Set());
  const [totalCoins,    setTotalCoins]    = useState(0);
  const [hydrated,      setHydrated]      = useState(false);
  const [didLevelUp,    setDidLevelUp]    = useState(false);

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const gc = localStorage.getItem(KEY_GAME_CLEARED);
      if (gc) setGameClearedIds(new Set(JSON.parse(gc) as number[]));
      const cd = localStorage.getItem(KEY_COOKING_DONE);
      if (cd) setCookingDoneIds(new Set(JSON.parse(cd) as number[]));
      const coins = parseInt(localStorage.getItem(KEY_COINS) ?? "0", 10);
      if (!isNaN(coins)) setTotalCoins(coins);
    } catch { /* ignore */ }
    setHydrated(true);
  }, []);

  // ── Handlers ─────────────────────────────────────────────────────────────

  const goToGame = (id: number) => {
    setStageId(id);
    setScreen("gamePlaying");
  };

  const goToRealCooking = (id: number) => {
    setStageId(id);
    setScreen("realCooking");
  };

  const goToStageSelect = () => setScreen("stageSelect");

  /** Called when game is cleared for a stage (first time) */
  const handleGameClear = () => {
    const updated = new Set([...gameClearedIds, stageId]);
    setGameClearedIds(updated);
    try {
      localStorage.setItem(KEY_GAME_CLEARED, JSON.stringify([...updated]));
    } catch { /* ignore */ }
  };

  /** Locks in whether finishing this stage's real cooking will complete its level,
   *  computed before cookingDoneIds is mutated so it can't change mid-celebration. */
  const goToParentConfirm = () => {
    const stage = getStage(stageId);
    if (stage) {
      const wouldBeDone = new Set([...cookingDoneIds, stageId]);
      setDidLevelUp(
        !isLevelComplete(stage.level, cookingDoneIds) &&
          isLevelComplete(stage.level, wouldBeDone)
      );
    }
    setScreen("parentConfirm");
  };

  /** Called after parent confirms cooking */
  const handleCookingConfirmed = () => {
    const stage = getStage(stageId);
    if (!stage) return;

    const updatedCooking = new Set([...cookingDoneIds, stageId]);
    setCookingDoneIds(updatedCooking);

    const newCoins = totalCoins + stage.coinReward;
    setTotalCoins(newCoins);

    try {
      localStorage.setItem(KEY_COOKING_DONE, JSON.stringify([...updatedCooking]));
      localStorage.setItem(KEY_COINS, String(newCoins));
    } catch { /* ignore */ }

    // Delay to let celebration animation play, then return to stage select
    setTimeout(goToStageSelect, 2400);
  };

  // ── Loading ───────────────────────────────────────────────────────────────

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-purple-400 font-black text-lg animate-pulse">
          よみこみちゅう…
        </p>
      </div>
    );
  }

  const currentStage = getStage(stageId);

  // ── Screens ───────────────────────────────────────────────────────────────

  if (screen === "stageSelect") {
    return (
      <StageSelectScreen
        gameClearedIds={gameClearedIds}
        cookingDoneIds={cookingDoneIds}
        totalCoins={totalCoins}
        onSelectStage={goToGame}
        onRealCooking={goToRealCooking}
      />
    );
  }

  if (!currentStage) return null;

  if (screen === "gamePlaying") {
    return (
      <GameScreen
        key={stageId}
        stage={currentStage}
        onGameClear={handleGameClear}
        onRealCooking={() => goToRealCooking(stageId)}
        onStageSelect={goToStageSelect}
      />
    );
  }

  if (screen === "realCooking" && currentStage.realRecipe) {
    return (
      <RealCookingScreen
        stage={currentStage}
        onDone={goToParentConfirm}
        onBack={() => setScreen("gamePlaying")}
      />
    );
  }

  if (screen === "parentConfirm") {
    return (
      <ParentConfirmScreen
        stage={currentStage}
        didLevelUp={didLevelUp}
        onConfirmed={handleCookingConfirmed}
        onSkip={goToStageSelect}
      />
    );
  }

  return null;
}
