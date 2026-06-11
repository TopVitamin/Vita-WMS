export interface VisualColorConfig {
  color: string;
  bgColor?: string;
}

export const zoneTypeVisualMap: Record<string, VisualColorConfig> = {
  storage: { color: "var(--purple-600)" },
  pick_face: { color: "var(--info-500)" },
  staging: { color: "var(--warning-500)" },
  qc_return: { color: "var(--error-500)" },
};

export const locationUsageVisualMap: Record<string, VisualColorConfig> = {
  bulk_storage: { color: "var(--purple-600)" },
  pick_face: { color: "var(--info-500)" },
  transit: { color: "var(--warning-500)" },
  workstation: { color: "var(--success-600)" },
};

export const locationStatusVisualMap: Record<string, VisualColorConfig> = {
  normal: { color: "var(--success-500)", bgColor: "var(--success-50)" },
  sealed: { color: "var(--error-500)", bgColor: "var(--error-50)" },
  inbound_only: { color: "var(--info-500)", bgColor: "var(--info-50)" },
  outbound_only: { color: "var(--warning-500)", bgColor: "var(--warning-50)" },
};

export const containerCategoryVisualMap: Record<string, VisualColorConfig> = {
  box: { color: "var(--info-500)" },
  pallet: { color: "var(--purple-600)" },
  cage: { color: "var(--warning-500)" },
  carton: { color: "var(--success-600)" },
};

export const seedingWallUsageVisualMap: Record<string, VisualColorConfig> = {
  order_seeding: { color: "var(--purple-600)" },
  collection_seeding: { color: "var(--info-500)" },
};

export const dashboardChartPalette = [
  "var(--purple-600)",
  "var(--purple-400)",
  "var(--purple-300)",
  "var(--purple-200)",
  "var(--gray-300)",
];
