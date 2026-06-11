import ReportPageTemplate from "./ReportPageTemplate";
import { listInventoryItems } from "../../services/mock";

interface InventoryReportPageProps {
  onNavigate?: (path: string) => void;
}

const trend = [
  { date: "06/03", stock: 8120, alerts: 4 },
  { date: "06/04", stock: 8350, alerts: 3 },
  { date: "06/05", stock: 8290, alerts: 5 },
  { date: "06/06", stock: 8610, alerts: 5 },
  { date: "06/07", stock: 8840, alerts: 4 },
  { date: "06/08", stock: 8720, alerts: 6 },
  { date: "06/09", stock: 8950, alerts: 5 },
];

export default function InventoryReportPage({ onNavigate }: InventoryReportPageProps) {
  const inventoryItems = listInventoryItems();
  const totalStock = inventoryItems.reduce((sum, item) => sum + item.totalStock, 0);
  const lowStock = inventoryItems.filter((item) => item.totalStock < item.safetyStock).length;
  const frozen = inventoryItems.reduce((sum, item) => sum + item.frozenStock, 0);

  return (
    <ReportPageTemplate
      title="库存报表"
      description="统计库存总量、库存预警、冻结库存和库龄结构。"
      currentPath="/reports/inventory"
      onNavigate={onNavigate}
      kpis={[
        { label: "总库存", value: totalStock.toLocaleString(), unit: "件" },
        { label: "SKU 数", value: inventoryItems.length, unit: "个" },
        { label: "低库存 SKU", value: lowStock, tone: lowStock > 0 ? "warning" : "success" },
        { label: "冻结库存", value: frozen, unit: "件", tone: "info" },
      ]}
      barData={trend}
      barKeys={[
        { key: "stock", name: "库存件数", color: "var(--primary)" },
        { key: "alerts", name: "预警 SKU", color: "var(--warning-500)" },
      ]}
      pieData={[
        { name: "正常", value: inventoryItems.filter((item) => item.stockStatus === "正常").length, color: "var(--success-500)" },
        { name: "不足", value: inventoryItems.filter((item) => item.stockStatus === "不足").length, color: "var(--warning-500)" },
        { name: "缺货", value: inventoryItems.filter((item) => item.stockStatus === "缺货").length, color: "var(--error-500)" },
        { name: "超储/呆滞", value: inventoryItems.filter((item) => item.stockStatus === "超储" || item.stockStatus === "呆滞").length, color: "var(--info-500)" },
      ]}
      lineData={trend.map((item) => ({ date: item.date, turnover: 5.8 + (item.alerts / 10) }))}
      lineKey={{ key: "turnover", name: "周转次数", color: "var(--info-600)" }}
      tableColumns={[
        { key: "sku", label: "SKU" },
        { key: "name", label: "商品" },
        { key: "stock", label: "总库存", align: "right" },
        { key: "available", label: "可用库存", align: "right" },
        { key: "status", label: "库存状态" },
      ]}
      tableData={inventoryItems.slice(0, 6).map((item) => ({
        sku: item.skuCode,
        name: item.productName,
        stock: item.totalStock,
        available: item.availableStock,
        status: item.stockStatus,
      }))}
    />
  );
}
