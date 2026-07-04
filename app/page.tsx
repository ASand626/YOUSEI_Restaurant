"use client";

import { useState, useEffect } from "react";
import { getStage, canBuyLevel, getLevel } from "@/lib/stages";
import { getCurrentUser, loginOrRegister, logout, userScopedKey } from "@/lib/auth";
import LoginScreen from "@/components/LoginScreen";
import StageSelectScreen from "@/components/StageSelectScreen";
import GameScreen from "@/components/GameScreen";
import RealCookingScreen from "@/components/RealCookingScreen";
import ParentConfirmScreen from "@/components/ParentConfirmScreen";

// ── Persistence keys (v2 — level-based redesign; namespaced per user) ─────────
const KEY_GAME_CLEARED    = "fr-game-cleared-v2";
const KEY_COOKING_DONE    = "fr-cooking-done-v2";
const KEY_COINS           = "fr-coins-v2";
const KEY_UNLOCKED_LEVELS = "fr-unlocked-levels-v1";

// ── Screen types ──────────────────────────────────────────────────────────────
type Screen =
  | "login"
  | "stageSelect"
  | "gamePlaying"
  | "realCooking"
  | "parentConfirm";

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [screen,        setScreen]        = useState<Screen>("login");
  const [username,      setUsername]      = useState<string | null>(null);
  const [stageId,       setStageId]       = useState(1);
  const [gameClearedIds, setGameClearedIds] = useState<Set<number>>(new Set());
  const [cookingDoneIds, setCookingDoneIds] = useState<Set<number>>(new Set());
  const [totalCoins,    setTotalCoins]    = useState(0);
  const [unlockedLevelIds, setUnlockedLevelIds] = useState<Set<number>>(new Set([1]));
  const [hydrated,      setHydrated]      = useState(false);

  const loadProgressFor = (name: string) => {
    try {
      const gc = localStorage.getItem(userScopedKey(KEY_GAME_CLEARED, name));
      setGameClearedIds(gc ? new Set(JSON.parse(gc) as number[]) : new Set());
      const cd = localStorage.getItem(userScopedKey(KEY_COOKING_DONE, name));
      setCookingDoneIds(cd ? new Set(JSON.parse(cd) as number[]) : new Set());
      const coins = parseInt(localStorage.getItem(userScopedKey(KEY_COINS, name)) ?? "0", 10);
      setTotalCoins(isNaN(coins) ? 0 : coins);
      const ul = localStorage.getItem(userScopedKey(KEY_UNLOCKED_LEVELS, name));
      setUnlockedLevelIds(ul ? new Set(JSON.parse(ul) as number[]) : new Set([1]));
    } catch { /* ignore */ }
  };

  // Resume the logged-in profile from localStorage, if any
  useEffect(() => {
    const current = getCurrentUser();
    if (current) {
      setUsername(current);
      loadProgressFor(current);
      setScreen("stageSelect");
    }
    setHydrated(true);
  }, []);

  // ── Handlers ─────────────────────────────────────────────────────────────

  const handleLogin = (name: string) => {
    loginOrRegister(name);
    setUsername(name);
    loadProgressFor(name);
    setScreen("stageSelect");
  };

  const handleLogout = () => {
    logout();
    setUsername(null);
    setGameClearedIds(new Set());
    setCookingDoneIds(new Set());
    setTotalCoins(0);
    setUnlockedLevelIds(new Set([1]));
    setScreen("login");
  };

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
    if (!username) return;
    const updated = new Set([...gameClearedIds, stageId]);
    setGameClearedIds(updated);
    try {
      localStorage.setItem(userScopedKey(KEY_GAME_CLEARED, username), JSON.stringify([...updated]));
    } catch { /* ignore */ }
  };

  const goToParentConfirm = () => setScreen("parentConfirm");

  /** Called after parent confirms cooking */
  const handleCookingConfirmed = () => {
    const stage = getStage(stageId);
    if (!stage || !username) return;

    const updatedCooking = new Set([...cookingDoneIds, stageId]);
    setCookingDoneIds(updatedCooking);

    const newCoins = totalCoins + stage.coinReward;
    setTotalCoins(newCoins);

    try {
      localStorage.setItem(userScopedKey(KEY_COOKING_DONE, username), JSON.stringify([...updatedCooking]));
      localStorage.setItem(userScopedKey(KEY_COINS, username), String(newCoins));
    } catch { /* ignore */ }

    // Delay to let celebration animation play, then return to stage select
    setTimeout(goToStageSelect, 2400);
  };

  /** Spends coins to buy the next level's tool. Returns whether the purchase went through. */
  const handleUnlockLevel = (levelId: number): boolean => {
    if (!username || !canBuyLevel(levelId, unlockedLevelIds, totalCoins)) return false;
    const level = getLevel(levelId);
    if (!level) return false;

    const newCoins = totalCoins - level.unlockCost;
    const updatedUnlocked = new Set([...unlockedLevelIds, levelId]);
    setTotalCoins(newCoins);
    setUnlockedLevelIds(updatedUnlocked);

    try {
      localStorage.setItem(userScopedKey(KEY_COINS, username), String(newCoins));
      localStorage.setItem(userScopedKey(KEY_UNLOCKED_LEVELS, username), JSON.stringify([...updatedUnlocked]));
    } catch { /* ignore */ }

    return true;
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

  if (screen === "login" || !username) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  if (screen === "stageSelect") {
    return (
      <StageSelectScreen
        username={username}
        gameClearedIds={gameClearedIds}
        cookingDoneIds={cookingDoneIds}
        totalCoins={totalCoins}
        unlockedLevelIds={unlockedLevelIds}
        onSelectStage={goToGame}
        onRealCooking={goToRealCooking}
        onLogout={handleLogout}
        onUnlockLevel={handleUnlockLevel}
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
        onConfirmed={handleCookingConfirmed}
        onSkip={goToStageSelect}
      />
    );
  }

  return null;
}
