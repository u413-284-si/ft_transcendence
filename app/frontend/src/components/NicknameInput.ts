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
          label: i18next.t("nicknameInput.playerNicknameLabel", { i: i }),
          name: `player-${i}`,
          placeholder: i18next.t("nicknameInput.enterYourNicknameText"),
          type: "text",
          errorId: `player-error-${i}`
        })}
        ${Radio({
          id: `choice-${i}`,
          name: "userChoice",
          value: `${i}`,
          label: i18next.t("nicknameInput.playerChoiceLabel", { i: i }),
          checked: isChecked
        })}
      </div>
    `;
  }
  return nicknameInputs;
}
