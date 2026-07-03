import { StageDefinition } from "./stages";

export interface ValidationResult {
  success: boolean;
  message: string;
  subMessage: string;
}

/** The in-game step card id for the step at `index` in the real recipe. */
export function stepCardId(index: number): string {
  return `step-${index}`;
}

/**
 * Validates that the player arranged the recipe's step cards in the
 * same order they appear in the real recipe.
 */
export function validateGameOrder(
  orderedIds: string[],
  stage: StageDefinition
): ValidationResult {
  const steps = stage.realRecipe.steps;

  if (orderedIds.length < steps.length) {
    return {
      success: false,
      message: "まだたりないよ！",
      subMessage: "ぜんぶの てじゅんカードを ならべてね！",
    };
  }

  for (let i = 0; i < steps.length; i++) {
    if (orderedIds[i] !== stepCardId(i)) {
      return {
        success: false,
        message: "じゅんばんが ちがうよ！",
        subMessage: `${i + 1}ばんめは「${steps[i].gameLabel}」だよ！`,
      };
    }
  }

  return {
    success: true,
    message: "やったー！🎉",
    subMessage: stage.successSubMessage,
  };
}
