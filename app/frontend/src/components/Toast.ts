export type ToastVariant = "success" | "error" | "warning" | "info";

export type ToastOptions = {
  variant: ToastVariant;
  text: string;
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
    textColor: "text-green-400",
    progressColor: "bg-green-400",
    borderColor: "border-green-400",
    shadowColor: "shadow-[0_0_10px_rgba(0,255,0,0.7)]"
  },
  error: {
    icon: "⛔️",
    textColor: "text-red-400",
    progressColor: "bg-red-400",
    borderColor: "border-red-400",
    shadowColor: "shadow-[0_0_10px_rgba(255,0,0,0.7)]"
  },
  warning: {
    icon: "⚡️",
    textColor: "text-yellow-300",
    progressColor: "bg-yellow-300",
    borderColor: "border-yellow-300",
    shadowColor: "shadow-[0_0_10px_rgba(255,255,0,0.7)]"
  },
  info: {
    icon: "💡",
    textColor: "text-cyan-300",
    progressColor: "bg-cyan-300",
    borderColor: "border-cyan-300",
    shadowColor: "shadow-[0_0_10px_rgba(0,255,255,0.7)]"
  }
};

export function Toast({ variant, text }: ToastOptions): string {
  const { icon, textColor, progressColor, borderColor, shadowColor } =
    toastVariants[variant];
  return /* HTML */ `
    <li
      class="relative flex justify-between items-center p-4 mb-2 rounded-md
      bg-black/60 border ${borderColor} ${shadowColor}
      transition-transform duration-300 group max-w-sm break-words animate-fade-in-right"
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
