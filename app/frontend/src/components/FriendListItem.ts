import { FriendRequest } from "../types/FriendRequest.js";
import { escapeHTML } from "../utility.js";
import { Button } from "./Button.js";

export function FriendListItem(request: FriendRequest): string {
  const onlineStatusClass = request.isOnline
    ? "text-cyan-400"
    : "text-gray-500";
  const onlineStatusText = request.isOnline ? "Online" : "Offline";

  return /* HTML */ `
    <li
      class="bg-[#0f0f0f] border border-cyan-400/50 rounded-xl p-4 shadow-md shadow-cyan-500/20 flex items-center space-x-4 hover:shadow-cyan-400/40 transition duration-300"
      data-request-id="${request.id}"
      data-friend-id="${request.friendId}"
    >
      <img
        src="${request.friendAvatar || "images/default-avatar.png"}"
        alt="${escapeHTML(request.friendUsername)}'s avatar"
        class="w-12 h-12 rounded-full border-2 border-cyan-400 shadow-md shadow-cyan-500/30 object-cover"
      />

      <div class="flex-1 overflow-hidden">
        <span class="block text-cyan-200 font-mono text-lg truncate">
          ${escapeHTML(request.friendUsername)}
        </span>
        <span class="online-status text-sm ${onlineStatusClass}">
          ${onlineStatusText}
        </span>
      </div>

      ${Button({
        text: "Remove",
        variant: "danger",
        size: "sm",
        className: "remove-friend-btn"
      })}
    </li>
  `;
}
