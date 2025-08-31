import { getAllBySelector, getById } from "../utility.js";
import { Checkbox } from "./Checkbox.js";
import { Input } from "./Input.js";
import { Radio } from "./Radio.js";
import { Select } from "./Select.js";

export function NicknameInput(players: number): string {
  let nicknameInputs = "";
  for (let i = 1; i <= players; i++) {
    const isChecked = i === 1 ? true : false;

    nicknameInputs += /* HTML */ `
      <div
        class="border border-teal p-4 rounded shadow-sm flex flex-col space-y-4"
      >
        ${Input({
          id: `nickname${i}`,
          label: i18next.t("nicknameInput.playerNickname", { i: i }),
          name: `player-${i}`,
          placeholder: i18next.t("nicknameInput.enterYourNickname"),
          type: "text",
          errorId: `player-error-${i}`,
          className: "disabled:bg-teal disabled:text-grey"
        })}
        ${Radio({
          id: `choice-${i}`,
          name: "userChoice",
          value: `${i}`,
          label: i18next.t("nicknameInput.playerChoice", { i: i }),
          checked: isChecked
        })}
        ${Checkbox({
          id: `ai-${i}`,
          name: `ai-player-${i}`,
          label: "AI Player",
          disabled: isChecked
        })}
        ${Select({
          id: `ai-strength-${i}`,
          name: `ai-strength-${i}`,
          label: "AI Strength",
          options: [
            { value: "easy", label: "Easy" },
            { value: "normal", label: "Normal" },
            { value: "hard", label: "Hard" }
          ],
          hidden: true
        })}
      </div>
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
  const AI_NAMES: Record<string, string> = {
    easy: "Norminette",
    normal: "Moulinette",
    hard: "Evaluator"
  };
  const baseName = AI_NAMES[strength] || "AI";
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

  if (!radio || !checkbox || !strengthDiv || !strengthSelect || !nicknameInput)
    return;

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
    }
  }
}
