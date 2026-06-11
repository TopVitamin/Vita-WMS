import { BarChart3, Download, Filter, RefreshCcw } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { WMSLayout } from "../../components/layouts/WMSLayout";
import { DataTableHeaderRow, KpiCard } from "../../components/business";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import type { DesignStatusTone } from "../../types/design-system";

interface ReportKpi {
  helper?: string;
  label: string;
  tone?: DesignStatusTone;
  unit?: string;
  value: string | number;
}

interface ReportTableColumn {
  align?: "left" | "right" | "center";
  key: string;
  label: string;
}

interface ReportPageTemplateProps {
  barData: Array<Record<string, string | number>>;
  barKeys: Array<{ color: string; key: string; name: string }>;
  currentPath: string;
  kpis: ReportKpi[];
  lineData: Array<Record<string, string | number>>;
  lineKey: { color: string; key: string; name: string };
  onNavigate?: (path: string) => void;
  pieData: Array<{ color: string; name: string; value: number }>;
  tableColumns: ReportTableColumn[];
  tableData: Array<Record<string, string | number>>;
  title: string;
  description: string;
}

function renderCellValue(value: string | number) {
  if (typeof value === "number") return value.toLocaleString();
  return value;
}

export default function ReportPageTemplate({
  barData,
  barKeys,
  currentPath,
  kpis,
  lineData,
  lineKey,
  onNavigate,
  pieData,
  tableColumns,
  tableData,
  title,
  description,
}: ReportPageTemplateProps) {
  return (
    <WMSLayout title={title} currentPath={currentPath} onNavigate={onNavigate}>
      <div className="p-6 space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Filter className="h-4 w-4" />
              筛选
            </Button>
            <Button variant="outline">
              <RefreshCcw className="h-4 w-4" />
              刷新
            </Button>
            <Button>
              <Download className="h-4 w-4" />
              导出
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap items-center gap-3">
              <Select defaultValue="7d">
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="统计周期" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">今日</SelectItem>
                  <SelectItem value="7d">近 7 天</SelectItem>
                  <SelectItem value="30d">近 30 天</SelectItem>
                  <SelectItem value="month">本月</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all">
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="仓库" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部仓库</SelectItem>
                  <SelectItem value="la">洛杉矶仓</SelectItem>
                  <SelectItem value="london">伦敦仓</SelectItem>
                  <SelectItem value="toronto">多伦多仓</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all">
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="客户" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部客户</SelectItem>
                  <SelectItem value="vita">维他很忙</SelectItem>
                  <SelectItem value="amazon">Amazon-US</SelectItem>
                  <SelectItem value="shopify">Shopify-EU</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-4 gap-4">
          {kpis.map((item) => (
            <KpiCard key={item.label} {...item} />
          ))}
        </div>

        <div className="grid grid-cols-12 gap-5">
          <Card className="col-span-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                趋势分析
              </CardTitle>
              <CardDescription>按天查看核心指标变化</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--gray-200)" />
                  <XAxis dataKey="date" stroke="var(--gray-600)" />
                  <YAxis stroke="var(--gray-600)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  {barKeys.map((item) => (
                    <Bar key={item.key} dataKey={item.key} name={item.name} fill={item.color} radius={[4, 4, 0, 0]} />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>结构占比</CardTitle>
              <CardDescription>按业务类型拆分</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={90} label>
                    {pieData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-12 gap-5">
          <Card className="col-span-5">
            <CardHeader>
              <CardTitle>{lineKey.name}</CardTitle>
              <CardDescription>核心效率指标趋势</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={lineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--gray-200)" />
                  <XAxis dataKey="date" stroke="var(--gray-600)" />
                  <YAxis stroke="var(--gray-600)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                    }}
                  />
                  <Line type="monotone" dataKey={lineKey.key} name={lineKey.name} stroke={lineKey.color} strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="col-span-7">
            <CardHeader>
              <CardTitle>明细排行</CardTitle>
              <CardDescription>当前周期内的重点对象</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-hidden rounded-b-lg border-t">
                <Table>
                  <TableHeader>
                    <DataTableHeaderRow>
                      {tableColumns.map((column) => (
                        <TableHead
                          key={column.key}
                          className={column.align === "right" ? "text-right" : column.align === "center" ? "text-center" : ""}
                        >
                          {column.label}
                        </TableHead>
                      ))}
                    </DataTableHeaderRow>
                  </TableHeader>
                  <TableBody>
                    {tableData.map((row, index) => (
                      <TableRow key={index}>
                        {tableColumns.map((column) => (
                          <TableCell
                            key={column.key}
                            className={column.align === "right" ? "text-right" : column.align === "center" ? "text-center" : ""}
                          >
                            {renderCellValue(row[column.key])}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </WMSLayout>
  );
}
