import type { WorkflowStep } from "../../types/design-system";
import { ChevronRight } from "lucide-react";

export function WorkflowStepBar({ steps, currentStepId }: { steps: WorkflowStep[]; currentStepId: string }) {
  const activeIndex = steps.findIndex((item) => item.id === currentStepId);

  return (
    <div className="flex flex-wrap items-center gap-y-4 gap-x-2">
      {steps.map((step, index) => {
        const isActive = step.id === currentStepId;
        const isDone = activeIndex > index;

        return (
          <div key={step.id} className="flex items-center gap-2 md:gap-3">
            <div
              className={`flex items-center gap-2 ${
                isActive ? "text-primary" : isDone ? "text-success-600" : "text-muted-foreground"
              }`}
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : isDone
                    ? "bg-success-600 text-success-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {index + 1}
              </div>
              <div>
                <div className={`text-sm ${isActive ? "font-semibold" : "font-normal"}`}>{step.label}</div>
                {step.description ? <div className="text-xs text-muted-foreground/80">{step.description}</div> : null}
              </div>
            </div>

            {index < steps.length - 1 && (
              <ChevronRight
                className={`h-4 w-4 mx-1 md:mx-2 shrink-0 ${
                  index < activeIndex ? "text-success-600" : "text-muted-foreground/40"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
