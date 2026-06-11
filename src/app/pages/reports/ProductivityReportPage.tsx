import ReportPageTemplate from "./ReportPageTemplate";

interface ProductivityReportPageProps {
  onNavigate?: (path: string) => void;
}

const trend = [
  { date: "06/03", tasks: 286, efficiency: 92 },
  { date: "06/04", tasks: 312, efficiency: 94 },
  { date: "06/05", tasks: 298, efficiency: 91 },
  { date: "06/06", tasks: 336, efficiency: 95 },
  { date: "06/07", tasks: 354, efficiency: 96 },
  { date: "06/08", tasks: 329, efficiency: 93 },
  { date: "06/09", tasks: 371, efficiency: 97 },
];

export default function ProductivityReportPage({ onNavigate }: ProductivityReportPageProps) {
  return (
    <ReportPageTemplate
      title="人效报表"
      description="统计收货、上架、拣货、复核、打包等岗位作业效率。"
      currentPath="/reports/productivity"
      onNavigate={onNavigate}
      kpis={[
        { label: "完成任务", value: "2,286", unit: "项" },
        { label: "人均件效", value: 426, unit: "件/人", tone: "success" },
        { label: "平均准确率", value: "99.2%", tone: "success" },
        { label: "异常工时", value: "18.5h", tone: "warning" },
      ]}
      barData={trend}
      barKeys={[
        { key: "tasks", name: "完成任务", color: "var(--primary)" },
        { key: "efficiency", name: "效率指数", color: "var(--success-500)" },
      ]}
      pieData={[
        { name: "拣货", value: 36, color: "var(--primary)" },
        { name: "收货", value: 24, color: "var(--success-500)" },
        { name: "打包", value: 22, color: "var(--warning-500)" },
        { name: "复核/盘点", value: 18, color: "var(--info-500)" },
      ]}
      lineData={trend}
      lineKey={{ key: "efficiency", name: "效率指数", color: "var(--success-600)" }}
      tableColumns={[
        { key: "name", label: "人员" },
        { key: "role", label: "岗位" },
        { key: "tasks", label: "任务数", align: "right" },
        { key: "qty", label: "处理件数", align: "right" },
        { key: "accuracy", label: "准确率", align: "right" },
      ]}
      tableData={[
        { name: "张三", role: "拣货", tasks: 186, qty: 3280, accuracy: "99.5%" },
        { name: "李四", role: "收货", tasks: 142, qty: 2960, accuracy: "99.1%" },
        { name: "王五", role: "打包", tasks: 168, qty: 2410, accuracy: "98.9%" },
        { name: "赵六", role: "复核", tasks: 154, qty: 2260, accuracy: "99.7%" },
      ]}
    />
  );
}
