import { Checkbox } from "./Checkbox.js";
import { Input } from "./Input.js";
import { Radio } from "./Radio.js";

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
          errorId: `player-error-${i}`
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
      </div>
    `;
  }
  return nicknameInputs;
}

export function initNicknameInputListeners(): void {
  const radios = document.querySelectorAll<HTMLInputElement>(
    'input[name="userChoice"]'
  );
  const checkboxes = document.querySelectorAll<HTMLInputElement>(
    'input[type="checkbox"][id^="ai-"]'
  );

  radios.forEach((radio, index) => {
    radio.addEventListener("change", () => {
      checkboxes.forEach((checkbox, cbIndex) => {
        if (cbIndex === index) {
          checkbox.checked = false;
          checkbox.disabled = true;
        } else {
          checkbox.disabled = false;
        }
      });
    });
  });
}
