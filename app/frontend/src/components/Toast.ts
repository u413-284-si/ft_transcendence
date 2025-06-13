export type ToastVariant = "success" | "error" | "warning" | "info";

export type ToastOptions = {
  variant: ToastVariant;
  text: string;
};

const toastVariants: Record<
  ToastVariant,
  { icon: string; textColor: string; progressColor: string }
> = {
  success: {
    icon: "✔️",
    textColor: "text-green-600",
    progressColor: "bg-green-600"
  },
  error: {
    icon: "❌",
    textColor: "text-red-600",
    progressColor: "bg-red-600"
  },
  warning: {
    icon: "⚠️",
    textColor: "text-yellow-500",
    progressColor: "bg-yellow-500"
  },
  info: {
    icon: "ℹ️",
    textColor: "text-blue-600",
    progressColor: "bg-blue-600"
  }
};

export function Toast({ variant, text }: ToastOptions): string {
  const { icon, textColor, progressColor } = toastVariants[variant];
  return `
    <li
      data-variant="${variant}"
      class="
        relative flex justify-between items-center w-96 p-4 mb-2 rounded bg-white shadow-lg
        transform translate-x-full transition duration-300
      "
    >
      <div class="flex items-center">
        <span class="text-2xl">${icon}</span>
        <span class="ml-3 ${textColor}">${text}</span>
      </div>
      <button class="ml-4 text-gray-400 hover:text-black">&times;</button>
      <span class="absolute bottom-0 left-0 h-1 ${progressColor} w-full animate-progress"></span>
    </li>
  `;
}
