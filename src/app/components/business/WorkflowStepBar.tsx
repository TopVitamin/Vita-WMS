import type { WorkflowStep } from "../../types/wms";

export function WorkflowStepBar({ steps, currentStepId }: { steps: WorkflowStep[]; currentStepId: string }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {steps.map((step, index) => {
        const isActive = step.id === currentStepId;
        const activeIndex = steps.findIndex((item) => item.id === currentStepId);
        const isDone = activeIndex > index;

        return (
          <div
            key={step.id}
            className={`flex items-center gap-2 ${isActive ? "text-primary" : isDone ? "text-success-600" : "text-muted-foreground"}`}
          >
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm ${
                isActive ? "bg-primary text-primary-foreground" : isDone ? "bg-success-600 text-white" : "bg-muted"
              }`}
            >
              {index + 1}
            </div>
            <div>
              <div className="text-sm font-medium">{step.label}</div>
              {step.description ? <div className="text-xs text-muted-foreground">{step.description}</div> : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
