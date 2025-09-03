import { getAllBySelector, getById } from "../utility.js";
import { Card } from "./Card.js";
import { Checkbox } from "./Checkbox.js";
import { Input } from "./Input.js";
import { Radio } from "./Radio.js";
import { Select } from "./Select.js";
import type { PlayerType } from "../types/IMatch.js";
import { clearInvalid } from "../validate.js";

export function NicknameInput(players: number, username: string): string {
  let nicknameInputs = "";
  for (let i = 1; i <= players; i++) {
    const isChecked = i === 1 ? true : false;

    nicknameInputs += /* HTML */ `
      ${Card({
        children: [
          Input({
            id: `nickname${i}`,
            label: i18next.t("nicknameInput.playerNickname", { i: i }),
            name: `player-${i}`,
            placeholder: i18next.t("nicknameInput.enterYourNickname"),
            type: "text",
            errorId: `player-error-${i}`,
            className: "disabled:bg-teal disabled:text-grey"
          }),
          Radio({
            id: `choice-${i}`,
            name: "userChoice",
            value: `${i}`,
            label: i18next.t("nicknameInput.playerChoice", {
              username: username,
              i: i
            }),
            checked: isChecked
          }),
          Checkbox({
            id: `ai-${i}`,
            name: `ai-player-${i}`,
            label: i18next.t("nicknameInput.aiPlayer"),
            disabled: isChecked
          }),
          Select({
            id: `ai-strength-${i}`,
            name: `ai-strength-${i}`,
            label: i18next.t("nicknameInput.aiStrength"),
            options: [
              {
                value: "AI_EASY",
                label: i18next.t("nicknameInput.aiStrengthEasy")
              },
              {
                value: "AI_MEDIUM",
                label: i18next.t("nicknameInput.aiStrengthMedium")
              },
              {
                value: "AI_HARD",
                label: i18next.t("nicknameInput.aiStrengthHard")
              }
            ],
            hidden: true
          })
        ]
      })}
    `;
  }
  return nicknameInputs;
}

export function initNicknameInputListeners(): void {
  const radios = getAllBySelector<HTMLInputElement>('input[name="userChoice"]');
  const checkboxes = getAllBySelector<HTMLInputElement>(
    'input[type="checkbox"][id^="ai-"]'
  );
  const strengthSelects = getAllBySelector<HTMLSelectElement>(
    'select[id^="select-ai-strength-"]'
  );

  radios.forEach((radio) => {
    radio.addEventListener("change", () => {
      for (let i = 0; i < radios.length; i++) {
        updateSlotUI(i);
      }
    });
  });

  checkboxes.forEach((checkbox, index) => {
    checkbox.addEventListener("change", () => {
      updateSlotUI(index);
    });
  });

  strengthSelects.forEach((select, index) => {
    select.addEventListener("change", () => {
      updateSlotUI(index);
    });
  });

  for (let i = 0; i < radios.length; i++) {
    updateSlotUI(i);
  }
}

function makeAIName(strength: string, slot: number): string {
  const AI_NAMES: Record<Exclude<PlayerType, "HUMAN">, string> = {
    AI_EASY: "Norminette",
    AI_MEDIUM: "Moulinette",
    AI_HARD: "Evaluator"
  };
  const baseName = AI_NAMES[strength as Exclude<PlayerType, "HUMAN">] ?? "AI";
  return `${baseName}-P${slot}`;
}

function updateSlotUI(index: number): void {
  const radio = getById<HTMLInputElement>(`choice-${index + 1}`);
  const checkbox = getById<HTMLInputElement>(`ai-${index + 1}`);
  const strengthDiv = getById<HTMLDivElement>(`ai-strength-${index + 1}`);
  const strengthSelect = getById<HTMLSelectElement>(
    `select-ai-strength-${index + 1}`
  );
  const nicknameInput = getById<HTMLInputElement>(`nickname${index + 1}`);
  const inputElements = getAllBySelector<HTMLInputElement>('[id^="nickname"]');
  const errorElements = getAllBySelector<HTMLElement>('[id^="player-error-"]');

  inputElements.forEach((inputEl, i) => {
    clearInvalid(inputEl, errorElements[i]);
  });

  if (radio.checked) {
    checkbox.checked = false;
    checkbox.disabled = true;
    strengthDiv.classList.add("hidden");
    nicknameInput.disabled = false;
    nicknameInput.value = "";
  } else {
    checkbox.disabled = false;

    if (checkbox.checked) {
      strengthDiv.classList.remove("hidden");
      nicknameInput.disabled = true;
      nicknameInput.value = makeAIName(strengthSelect.value, index + 1);
    } else {
      strengthDiv.classList.add("hidden");
      nicknameInput.disabled = false;
      nicknameInput.value = "";
    }
  }
}

export function getPlayerType(
  formData: FormData,
  playerIndex: number
): PlayerType {
  const isAi = formData.has(`ai-player-${playerIndex}`);
  if (!isAi) return "HUMAN";

  const type = formData.get(`ai-strength-${playerIndex}`);
  if (type === "AI_EASY" || type === "AI_MEDIUM" || type === "AI_HARD") {
    return type;
  }

  return "AI_MEDIUM";
}

export function formatPlayerName(name: string, type: PlayerType): string {
  if (type === "HUMAN") return name;

  return `🤖 ${name}`;
}
