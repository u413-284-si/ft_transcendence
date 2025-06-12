import { FriendRequest } from "../types/FriendRequest.js";
import { escapeHTML } from "../utility.js";
import { Button } from "./Button.js";

export function FriendListItem(
  request: FriendRequest,
  type: "friend" | "incoming" | "outgoing"
): string {
  const isOnline = request.isOnline ?? false;
  const onlineStatusClass = isOnline ? "text-cyan-400" : "text-gray-500";
  const onlineStatusText = isOnline ? "Online" : "Offline";

  const username = escapeHTML(request.friendUsername);

  const avatar = `
    <img
      src="${request.friendAvatar || "/images/default-avatar.png"}"
      alt="${username}'s avatar"
      class="w-12 h-12 rounded-full border-2 border-cyan-400 shadow-md shadow-cyan-500/30 object-cover"
    />
  `;

  let actionHTML = "";
  if (type === "friend") {
    actionHTML = `
      ${Button({
        text: "Remove",
        variant: "danger",
        className: "remove-friend-btn"
      })}
    `;
  } else if (type === "incoming") {
    actionHTML = `
      ${Button({
        text: "Accept",
        variant: "default",
        className: "accept-btn"
      })}
      ${Button({
        text: "Decline",
        variant: "danger",
        className: "decline-btn"
      })}
    `;
  } else if (type === "outgoing") {
    actionHTML = `
      <span class="text-gray-500 italic">Pending...</span>
      ${Button({
        text: "Delete",
        variant: "danger",
        className: "delete-request-btn"
      })}
    `;
  }

  return /* HTML */ `
    <li
      class="bg-[#0f0f0f] border border-cyan-400/50 rounded-xl p-4 shadow-md shadow-cyan-500/20 flex items-center space-x-4 hover:shadow-cyan-400/40 transition duration-300"
      data-request-id="${request.id}"
      data-friend-id="${request.friendId}"
    >
      ${avatar}
      <div class="flex-1 overflow-hidden">
        <span class="block text-cyan-200 font-mono text-lg truncate">
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
