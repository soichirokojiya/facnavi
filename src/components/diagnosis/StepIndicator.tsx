interface StepIndicatorProps {
  current: number;
  total: number;
}

export function StepIndicator({ current, total }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-2 mb-6">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
            i + 1 === current
              ? "bg-primary text-white"
              : i + 1 < current
              ? "bg-primary-light text-white"
              : "bg-gray-200 text-gray-500"
          }`}
        >
          {i + 1}
        </div>
      ))}
    </div>
  );
}
