import { FriendRequest } from "../types/FriendRequest.js";
import { escapeHTML } from "../utility.js";
import { Button } from "./Button.js";

export function FriendListItem(
  request: FriendRequest,
  type: "friend" | "incoming" | "outgoing"
): string {
  const isOnline = request.isOnline ?? false;
  const onlineStatusClass = isOnline ? "text-neon-green" : "text-grey";
  const onlineStatusText = isOnline
    ? i18next.t("global.online")
    : i18next.t("global.offline");

  const username = escapeHTML(request.friendUsername);

  const avatar = `
    <img
      src="${request.friendAvatar || "/images/default-avatar.png"}"
      alt="${username}'s i18next.t("global.avatar")"
      class="w-12 h-12 rounded-full border-2 border-neon-cyan object-cover hover:shadow-neon-cyan"
    />
  `;

  let actionHTML = "";
  if (type === "friend") {
    actionHTML = `
      ${Button({
        text: i18next.t("friendListItem.remove"),
        variant: "danger",
        className: "remove-friend-btn"
      })}
    `;
  } else if (type === "incoming") {
    actionHTML = `
      ${Button({
        text: i18next.t("friendListItem.accept"),
        variant: "default",
        className: "accept-btn"
      })}
      ${Button({
        text: i18next.t("friendListItem.decline"),
        variant: "danger",
        className: "decline-btn"
      })}
    `;
  } else if (type === "outgoing") {
    actionHTML = `
      <span class="text-grey0 italic">${i18next.t("friendListItem.pending")}...</span>
      ${Button({
        text: i18next.t("friendListItem.delete"),
        variant: "danger",
        className: "delete-request-btn"
      })}
    `;
  }

  return /* HTML */ `
    <li
      class="bg-emerald-dark border border-teal rounded-xl p-4 shadow-md flex items-center space-x-4 transition duration-300 w-xl h-24"
      data-request-id="${request.id}"
      data-friend-id="${request.friendId}"
    >
      <a
        href="/stats/${username}"
        class="avatar-link inline-block rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan"
      >
        ${avatar}
      </a>
      <div class="flex-1 overflow-hidden">
        <span class="block text-neon-cyan text-lg normal-case truncate">
          ${username}
        </span>
        ${type === "friend"
          ? `<span class="online-status text-sm ${onlineStatusClass}">${onlineStatusText}</span>`
          : ""}
      </div>
      <div class="flex items-center space-x-2">${actionHTML}</div>
    </li>
  `;
}
