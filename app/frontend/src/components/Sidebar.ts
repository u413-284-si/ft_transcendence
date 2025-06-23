import { DrawerItem } from "../Drawer.js";
import { Header3 } from "./Header3.js";
import { Button } from "./Button.js";

export function Sidebar(
  user: { username: string; avatar?: string },
  links: DrawerItem[]
): string {
  const avatar = user.avatar || "/images/default-avatar.png";

  const linkItems = links
    .map((item) => {
      const icon = item.icon ? svgIconString(item.icon) : "";
      const href = item.href ? `href="${item.href}"` : "";
      return /* HTML */ `
        <div
          class="flex items-center space-x-2 px-4 hover:underline text-left cursor-pointer"
          data-label="${item.label}"
        >
          ${icon}
          <a ${href} data-link><span>${item.label}</span></a>
        </div>
      `;
    })
    .join("");

  return /* HTML */ `
    <aside
      class="fixed top-0 right-0 h-full w-75 bg-emerald-dark text-neon-cyan border-l-2 border-emerald-light rounded-l-2xl z-40 shadow-lg transform transition-transform duration-300 translate-x-full"
      id="drawer-sidebar"
    >
      <div class="p-6 space-y-4">
        <img
          src="${avatar}"
          alt="User avatar"
          class="w-20 h-20 rounded-full border-3 border-white mx-auto shadow"
        />
        ${Header3({
          text: `${user.username}`,
          variant: "default",
          className: "mx-auto text-center"
        })}
        <div class="mt-12 space-y-2">${linkItems}</div>
        <div class="flex justify-center mt-6">
          ${Button({
            id: "drawer-close",
            text: "Close",
            variant: "default",
            size: "sm",
            type: "button",
            className: " mt-6"
          })}
        </div>
      </div>
    </aside>
  `;
}

function svgIconString(name: string): string {
  const getPaths = getIconPaths(name);
  return `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 text-neon-cyan shrink-0">
      ${getPaths.map((d) => `<path d="${d}" />`).join("")}
    </svg>
  `;
}

function getIconPaths(name: string): string[] {
  switch (name) {
    case "user":
      return [
        "M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z",
        "M4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
      ];
    case "stats":
      return [
        "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75Z",
        "M9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625Z",
        "M16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
      ];
    case "friends":
      return [
        "M15.182 15.182a4.5 4.5 0 0 1-6.364 0",
        "M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
        "M9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Z",
        "M14.625 9.75c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Z"
      ];
    case "settings":
      return [
        "M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z",
        "M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
      ];
    case "logout":
      return [
        "M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15",
        "M12 9l-3 3m0 0 3 3m-3-3h12.75"
      ];
    default:
      return [];
  }
}
