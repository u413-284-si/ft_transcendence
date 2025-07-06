export type ToastVariant = "success" | "error" | "warning" | "info";

export type ToastOptions = {
  variant: ToastVariant;
  text: string;
  customIcon?: string;
};

const toastVariants: Record<
  ToastVariant,
  {
    icon: string;
    textColor: string;
    progressColor: string;
    borderColor: string;
    shadowColor: string;
  }
> = {
  success: {
    icon: "✅",
    textColor: "text-neon-green",
    progressColor: "bg-neon-green",
    borderColor: "border-neon-green",
    shadowColor: "shadow-neon-green"
  },
  error: {
    icon: "⛔️",
    textColor: "text-neon-red",
    progressColor: "bg-neon-red",
    borderColor: "border-neon-red",
    shadowColor: "shadow-neon-red"
  },
  warning: {
    icon: "⚡️",
    textColor: "text-neon-yellow",
    progressColor: "bg-neon-yellow",
    borderColor: "border-neon-yellow",
    shadowColor: "shadow-neon-yellow"
  },
  info: {
    icon: "💡",
    textColor: "text-neon-cyan",
    progressColor: "bg-neon-cyan",
    borderColor: "border-neon-cyan",
    shadowColor: "shadow-neon-cyan"
  }
};

export function Toast({ variant, text, customIcon }: ToastOptions): string {
  const { textColor, progressColor, borderColor, shadowColor } =
    toastVariants[variant];
  const icon = customIcon ? customIcon : toastVariants[variant].icon;

  return /* HTML */ `
    <li
      class="relative flex justify-between items-center p-4 mb-2 rounded-md
      bg-black/60 border ${borderColor} ${shadowColor}
      group max-w-sm break-words animate-fade-in-right"
    >
      <div class="flex items-center space-x-3">
        <span class="text-2xl">${icon}</span>
        <span class="${textColor}">${text}</span>
      </div>
      <button class="ml-4 text-2xl ${textColor} hover:text-white">
        &times;
      </button>
      <span
        class="absolute bottom-0 left-0 h-1 w-full ${progressColor} ${shadowColor} animate-progress group-hover:[animation-play-state:paused]"
      ></span>
    </li>
  `;
}
