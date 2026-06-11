import ReportPageTemplate from "./ReportPageTemplate";

interface InboundReportPageProps {
  onNavigate?: (path: string) => void;
}

const trend = [
  { date: "06/03", orders: 38, qty: 2860 },
  { date: "06/04", orders: 42, qty: 3120 },
  { date: "06/05", orders: 35, qty: 2680 },
  { date: "06/06", orders: 51, qty: 3890 },
  { date: "06/07", orders: 47, qty: 3420 },
  { date: "06/08", orders: 44, qty: 3180 },
  { date: "06/09", orders: 56, qty: 4260 },
];

export default function InboundReportPage({ onNavigate }: InboundReportPageProps) {
  return (
    <ReportPageTemplate
      title="入库报表"
      description="统计到仓、收货、质检、上架等入库链路表现。"
      currentPath="/reports/inbound"
      onNavigate={onNavigate}
      kpis={[
        { label: "入库单数", value: 313, helper: "+12.4%", tone: "success" },
        { label: "收货件数", value: "23,410", unit: "件" },
        { label: "准时收货率", value: "96.8%", tone: "success" },
        { label: "待上架", value: 428, unit: "件", tone: "warning" },
      ]}
      barData={trend}
      barKeys={[
        { key: "orders", name: "入库单", color: "var(--success-500)" },
        { key: "qty", name: "收货件数", color: "var(--primary)" },
      ]}
      pieData={[
        { name: "采购入库", value: 52, color: "var(--success-500)" },
        { name: "退货入库", value: 21, color: "var(--warning-500)" },
        { name: "调拨入库", value: 18, color: "var(--info-500)" },
        { name: "其他", value: 9, color: "var(--gray-400)" },
      ]}
      lineData={trend.map((item) => ({ date: item.date, rate: 92 + (item.orders % 6) }))}
      lineKey={{ key: "rate", name: "收货及时率", color: "var(--success-600)" }}
      tableColumns={[
        { key: "supplier", label: "来源/客户" },
        { key: "orders", label: "入库单", align: "right" },
        { key: "qty", label: "件数", align: "right" },
        { key: "pending", label: "待上架", align: "right" },
        { key: "rate", label: "及时率", align: "right" },
      ]}
      tableData={[
        { supplier: "维他很忙", orders: 86, qty: 6420, pending: 120, rate: "98.2%" },
        { supplier: "Amazon-US", orders: 74, qty: 5380, pending: 96, rate: "96.5%" },
        { supplier: "Shopify-EU", orders: 58, qty: 4210, pending: 84, rate: "94.8%" },
        { supplier: "跨境小王", orders: 45, qty: 3180, pending: 66, rate: "93.6%" },
      ]}
    />
  );
}
