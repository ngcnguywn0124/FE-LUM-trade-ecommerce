import { CalendarClock, Banknote, Star, Check } from 'lucide-react';

export interface TransactionStep {
  id: number;
  label: string;
  sublabel: string;
  icon: React.ElementType;
}

export const TRANSACTION_STEPS: TransactionStep[] = [
  { id: 0, label: 'Hẹn gặp', sublabel: 'Xác nhận địa điểm & thời gian', icon: CalendarClock },
  { id: 1, label: 'Thanh toán', sublabel: 'Xác nhận giao - nhận tiền', icon: Banknote },
  { id: 2, label: 'Hoàn tất', sublabel: 'Giao dịch thành công', icon: Star },
];

interface TransactionStepTrackerProps {
  /** Index của bước đang xử lý (0, 1, 2) */
  currentStep: number;
  /** Các bước đã hoàn thành */
  completedSteps: number[];
}

const TransactionStepTracker = ({ currentStep, completedSteps }: TransactionStepTrackerProps) => {
  const getStepState = (stepId: number): 'completed' | 'active' | 'upcoming' => {
    if (completedSteps.includes(stepId)) return 'completed';
    if (stepId === currentStep) return 'active';
    return 'upcoming';
  };

  return (
    <div className="relative flex items-start justify-between gap-1 px-1">
      {TRANSACTION_STEPS.map((step, idx) => {
        const state = getStepState(step.id);
        const Icon = step.icon;
        const isLast = idx === TRANSACTION_STEPS.length - 1;

        return (
          <div key={step.id} className="relative flex flex-col items-center flex-1">
            {/* Connector line */}
            {!isLast && (
              <div
                className={`
                  absolute top-4 left-[calc(50%+16px)] right-[calc(-50%+16px)]
                  h-0.5 z-0 transition-colors duration-500
                  ${completedSteps.includes(step.id) ? 'bg-emerald-400' : 'bg-gray-200'}
                `}
              />
            )}

            {/* Icon circle */}
            <div
              className={`
                relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-300
                ${state === 'completed' ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm shadow-emerald-200' : ''}
                ${state === 'active' ? 'bg-white border-emerald-500 text-emerald-600 shadow-sm shadow-emerald-100 ring-4 ring-emerald-50' : ''}
                ${state === 'upcoming' ? 'bg-gray-50 border-gray-200 text-gray-300' : ''}
              `}
            >
              {state === 'completed' ? (
                <Check size={14} strokeWidth={2.5} />
              ) : (
                <Icon size={14} />
              )}
            </div>

            {/* Label */}
            <div className="mt-1.5 text-center">
              <p
                className={`text-[11px] font-semibold leading-none transition-colors
                  ${state === 'completed' ? 'text-emerald-600' : ''}
                  ${state === 'active' ? 'text-gray-900' : ''}
                  ${state === 'upcoming' ? 'text-gray-400' : ''}
                `}
              >
                {step.label}
              </p>
              <p
                className={`text-[10px] leading-tight mt-0.5 transition-colors
                  ${state === 'active' ? 'text-gray-500' : 'text-gray-300'}
                `}
              >
                {step.sublabel}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TransactionStepTracker;
