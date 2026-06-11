export type DesignStatusTone =
  | "success"
  | "warning"
  | "error"
  | "info"
  | "muted"
  | "primary";

export interface KpiMetric {
  label: string;
  value: string | number;
  unit?: string;
  tone?: DesignStatusTone;
  helper?: string;
}

export interface WorkflowStep {
  id: string;
  label: string;
  description?: string;
}

export interface OperationLogItem {
  id: string;
  time: string;
  operator?: string;
  action: string;
  detail?: string;
  tone?: DesignStatusTone;
}

export type WmsStatusTone = DesignStatusTone;
