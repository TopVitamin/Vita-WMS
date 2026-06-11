import ReportPageTemplate from "./ReportPageTemplate";

interface OutboundReportPageProps {
  onNavigate?: (path: string) => void;
}

const trend = [
  { date: "06/03", orders: 118, qty: 2460 },
  { date: "06/04", orders: 126, qty: 2590 },
  { date: "06/05", orders: 132, qty: 2710 },
  { date: "06/06", orders: 109, qty: 2260 },
  { date: "06/07", orders: 141, qty: 3020 },
  { date: "06/08", orders: 137, qty: 2890 },
  { date: "06/09", orders: 154, qty: 3260 },
];

export default function OutboundReportPage({ onNavigate }: OutboundReportPageProps) {
  return (
    <ReportPageTemplate
      title="出库报表"
      description="统计波次、拣货、复核、称重出库等出库链路表现。"
      currentPath="/reports/outbound"
      onNavigate={onNavigate}
      kpis={[
        { label: "出库单数", value: 917, helper: "+8.6%", tone: "success" },
        { label: "出库件数", value: "19,190", unit: "件" },
        { label: "准时出库率", value: "97.4%", tone: "success" },
        { label: "待出库包裹", value: 42, tone: "warning" },
      ]}
      barData={trend}
      barKeys={[
        { key: "orders", name: "出库单", color: "var(--primary)" },
        { key: "qty", name: "出库件数", color: "var(--warning-500)" },
      ]}
      pieData={[
        { name: "销售出库", value: 68, color: "var(--primary)" },
        { name: "调拨出库", value: 14, color: "var(--info-500)" },
        { name: "退货出库", value: 10, color: "var(--warning-500)" },
        { name: "其他", value: 8, color: "var(--gray-400)" },
      ]}
      lineData={trend.map((item) => ({ date: item.date, rate: 94 + (item.orders % 5) }))}
      lineKey={{ key: "rate", name: "准时出库率", color: "var(--primary)" }}
      tableColumns={[
        { key: "customer", label: "客户" },
        { key: "orders", label: "出库单", align: "right" },
        { key: "waves", label: "波次数", align: "right" },
        { key: "packages", label: "包裹数", align: "right" },
        { key: "rate", label: "准时率", align: "right" },
      ]}
      tableData={[
        { customer: "Amazon-US", orders: 286, waves: 42, packages: 314, rate: "98.1%" },
        { customer: "Walmart-US", orders: 214, waves: 31, packages: 238, rate: "97.6%" },
        { customer: "Shopify-EU", orders: 168, waves: 26, packages: 190, rate: "96.9%" },
        { customer: "eBay-UK", orders: 142, waves: 21, packages: 163, rate: "95.8%" },
      ]}
    />
  );
}
