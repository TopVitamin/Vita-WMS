import { useMemo, useState } from "react";
import { Download, Layers3, MapPin, Package, RefreshCcw, Search } from "lucide-react";
import { toast } from "sonner";
import { WMSLayout } from "../components/layouts/WMSLayout";
import { DataTableHeaderRow, DataTableShell, KpiCard, KpiGrid, PageHeader, ListPageLayout } from "../components/business";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";

interface InventoryQueryPageProps {
  onNavigate: (path: string) => void;
}

type ViewType = "sku" | "location" | "sku-batch" | "sku-location" | "detail";

interface InventoryLedgerRow {
  id: string;
  owner: string;
  warehouse: string;
  sku: string;
  productName: string;
  batchNo: string;
  location: string;
  actualQty: number;
  lockedQty: number;
  availableQty: number;
}

interface InventoryViewRow {
  id: string;
  owner: string;
  warehouse: string;
  sku?: string;
  productName?: string;
  batchNo?: string;
  location?: string;
  skuCount?: number;
  batchCount?: number;
  actualQty: number;
  lockedQty: number;
  availableQty: number;
}

const inventoryLedger: InventoryLedgerRow[] = [
  { id: "1", owner: "维他很忙", warehouse: "洛杉矶仓", sku: "ABC-123456", productName: "多功能蓝牙耳机", batchNo: "LOT-20260601-A", location: "A01-01-01", actualQty: 420, lockedQty: 30, availableQty: 390 },
  { id: "2", owner: "维他很忙", warehouse: "洛杉矶仓", sku: "ABC-123456", productName: "多功能蓝牙耳机", batchNo: "LOT-20260601-A", location: "A01-01-05", actualQty: 310, lockedQty: 0, availableQty: 310 },
  { id: "3", owner: "维他很忙", warehouse: "洛杉矶仓", sku: "ABC-123456", productName: "多功能蓝牙耳机", batchNo: "LOT-20260608-B", location: "A01-02-01", actualQty: 250, lockedQty: 40, availableQty: 210 },
  { id: "4", owner: "维他很忙", warehouse: "安大略仓", sku: "ABC-123456", productName: "多功能蓝牙耳机", batchNo: "LOT-20260608-B", location: "B01-01-02", actualQty: 270, lockedQty: 0, availableQty: 270 },
  { id: "5", owner: "维他很忙", warehouse: "洛杉矶仓", sku: "ABC-123457", productName: "智能手环运动版", batchNo: "LOT-20260528-A", location: "A01-01-01", actualQty: 360, lockedQty: 20, availableQty: 340 },
  { id: "6", owner: "维他很忙", warehouse: "洛杉矶仓", sku: "ABC-123457", productName: "智能手环运动版", batchNo: "LOT-20260606-B", location: "A01-02-03", actualQty: 530, lockedQty: 20, availableQty: 510 },
  { id: "7", owner: "跨境小王", warehouse: "洛杉矶仓", sku: "DEF-789012", productName: "运动水杯 1L", batchNo: "LOT-20260530-A", location: "C01-01-01", actualQty: 900, lockedQty: 0, availableQty: 900 },
  { id: "8", owner: "跨境小王", warehouse: "洛杉矶仓", sku: "DEF-789012", productName: "运动水杯 1L", batchNo: "LOT-20260530-A", location: "C01-01-02", actualQty: 650, lockedQty: 50, availableQty: 600 },
  { id: "9", owner: "跨境小王", warehouse: "安大略仓", sku: "DEF-789012", productName: "运动水杯 1L", batchNo: "LOT-20260607-B", location: "B02-01-01", actualQty: 750, lockedQty: 50, availableQty: 700 },
  { id: "10", owner: "跨境小王", warehouse: "洛杉矶仓", sku: "GHI-345678", productName: "瑜伽垫专业版", batchNo: "LOT-20260515-A", location: "D01-01-01", actualQty: 96, lockedQty: 0, availableQty: 96 },
  { id: "11", owner: "跨境小王", warehouse: "洛杉矶仓", sku: "GHI-345678", productName: "瑜伽垫专业版", batchNo: "LOT-20260515-A", location: "D01-01-02", actualQty: 60, lockedQty: 0, availableQty: 60 },
];

const viewConfigs: Record<ViewType, { label: string; description: string; scope: "核心视图" | "作业视图" }> = {
  sku: { label: "SKU库存", description: "按货主、仓库和SKU汇总，适合主管快速查看商品整体库存。", scope: "核心视图" },
  location: { label: "库位库存", description: "按库位汇总，查看每个库位放了多少货、涉及多少SKU和批次。", scope: "核心视图" },
  "sku-batch": { label: "SKU-批次库存", description: "查看指定SKU各批次的库存，不展开批次分布在哪些库位。", scope: "核心视图" },
  "sku-location": { label: "SKU-库位库存", description: "查看指定SKU在各库位的库存，可直接辅助拣货定位。", scope: "作业视图" },
  detail: { label: "SKU-批次-库位", description: "最细库存粒度，精确到SKU、批次和库位，供上架、拣货、移库使用。", scope: "作业视图" },
};

function aggregateRows(rows: InventoryLedgerRow[], view: ViewType): InventoryViewRow[] {
  if (view === "detail") return rows;

  const groups = new Map<string, InventoryViewRow & { skuSet: Set<string>; batchSet: Set<string> }>();
  rows.forEach((row) => {
    const dimensions = view === "sku"
      ? [row.owner, row.warehouse, row.sku]
      : view === "location"
        ? [row.owner, row.warehouse, row.location]
        : view === "sku-batch"
          ? [row.owner, row.warehouse, row.sku, row.batchNo]
          : [row.owner, row.warehouse, row.sku, row.location];
    const key = dimensions.join("|");
    const current = groups.get(key) ?? {
      id: key,
      owner: row.owner,
      warehouse: row.warehouse,
      sku: view === "location" ? undefined : row.sku,
      productName: view === "location" ? undefined : row.productName,
      batchNo: view === "sku-batch" ? row.batchNo : undefined,
      location: view === "location" || view === "sku-location" ? row.location : undefined,
      actualQty: 0,
      lockedQty: 0,
      availableQty: 0,
      skuSet: new Set<string>(),
      batchSet: new Set<string>(),
    };
    current.actualQty += row.actualQty;
    current.lockedQty += row.lockedQty;
    current.availableQty += row.availableQty;
    current.skuSet.add(row.sku);
    current.batchSet.add(row.batchNo);
    groups.set(key, current);
  });

  return Array.from(groups.values()).map(({ skuSet, batchSet, ...row }) => ({
    ...row,
    skuCount: skuSet.size,
    batchCount: batchSet.size,
  }));
}

function QuantityCell({ value, tone = "default" }: { value: number; tone?: "default" | "locked" | "available" }) {
  const className = tone === "locked"
    ? value > 0 ? "font-medium text-warning-600" : "text-muted-foreground"
    : tone === "available" ? "font-medium text-success-600" : "font-medium";
  return <TableCell className={`text-right tabular-nums ${className}`}>{value.toLocaleString()}</TableCell>;
}

export default function InventoryQueryPage({ onNavigate }: InventoryQueryPageProps) {
  const [view, setView] = useState<ViewType>("sku");
  const [keyword, setKeyword] = useState("");
  const [owner, setOwner] = useState("all");
  const [warehouse, setWarehouse] = useState("all");

  const filteredLedger = useMemo(() => inventoryLedger.filter((row) => {
    const normalizedKeyword = keyword.trim().toLowerCase();
    const matchesKeyword = !normalizedKeyword || [row.sku, row.productName, row.batchNo, row.location]
      .some((value) => value.toLowerCase().includes(normalizedKeyword));
    return matchesKeyword
      && (owner === "all" || row.owner === owner)
      && (warehouse === "all" || row.warehouse === warehouse);
  }), [keyword, owner, warehouse]);

  const viewRows = useMemo(() => aggregateRows(filteredLedger, view), [filteredLedger, view]);
  const metrics = useMemo(() => ({
    skuCount: new Set(filteredLedger.map((row) => row.sku)).size,
    locationCount: new Set(filteredLedger.map((row) => `${row.warehouse}|${row.location}`)).size,
    actualQty: filteredLedger.reduce((sum, row) => sum + row.actualQty, 0),
    lockedQty: filteredLedger.reduce((sum, row) => sum + row.lockedQty, 0),
    availableQty: filteredLedger.reduce((sum, row) => sum + row.availableQty, 0),
  }), [filteredLedger]);

  const resetFilters = () => {
    setKeyword("");
    setOwner("all");
    setWarehouse("all");
  };

  const renderDimensionHeaders = () => {
    if (view === "location") return <><TableHead>库位</TableHead><TableHead className="text-right">SKU数</TableHead><TableHead className="text-right">批次数</TableHead></>;
    return <>
      <TableHead className="w-[150px]">SKU编码</TableHead>
      <TableHead>商品名称</TableHead>
      {view === "sku-batch" || view === "detail" ? <TableHead>批次号</TableHead> : null}
      {view === "sku-location" || view === "detail" ? <TableHead>库位</TableHead> : null}
      {view === "sku" ? <><TableHead className="text-right">库位数</TableHead><TableHead className="text-right">批次数</TableHead></> : null}
    </>;
  };

  const renderDimensionCells = (row: InventoryViewRow) => {
    if (view === "location") return <>
      <TableCell><div className="flex items-center gap-2 font-mono text-sm"><MapPin className="h-4 w-4 text-primary" />{row.location}</div></TableCell>
      <TableCell className="text-right tabular-nums">{row.skuCount}</TableCell>
      <TableCell className="text-right tabular-nums">{row.batchCount}</TableCell>
    </>;
    return <>
      <TableCell>
        <a
          href="#"
          className="font-mono text-primary hover:underline text-sm"
          onClick={(e) => {
            e.preventDefault();
            if (row.sku) {
              onNavigate(`/inventory/detail/${row.sku}`);
            }
          }}
        >
          {row.sku}
        </a>
      </TableCell>
      <TableCell>{row.productName}</TableCell>
      {view === "sku-batch" || view === "detail" ? <TableCell className="font-mono text-sm">{row.batchNo}</TableCell> : null}
      {view === "sku-location" || view === "detail" ? <TableCell className="font-mono text-sm">{row.location}</TableCell> : null}
      {view === "sku" ? <><TableCell className="text-right tabular-nums">{row.skuCount ? new Set(filteredLedger.filter((item) => item.sku === row.sku && item.warehouse === row.warehouse).map((item) => item.location)).size : 0}</TableCell><TableCell className="text-right tabular-nums">{row.batchCount}</TableCell></> : null}
    </>;
  };

  return (
    <WMSLayout title="库存查询" currentPath="/inventory/query" onNavigate={onNavigate}>
      <ListPageLayout
        header={
          <PageHeader
            title="库存查询"
            description="同一份库存台账按不同业务维度汇总；维度越细，越接近实际库内作业。"
            actions={
              <Button variant="outline" onClick={() => toast.success(`已生成${viewConfigs[view].label}导出任务`)}>
                <Download className="mr-2 h-4 w-4" />
                导出当前视图
              </Button>
            }
          />
        }
        kpis={
          <KpiGrid columns={5}>
            <KpiCard label="SKU数" value={metrics.skuCount} unit="个" />
            <KpiCard label="库位数" value={metrics.locationCount} unit="个" />
            <KpiCard label="实际库存" value={metrics.actualQty.toLocaleString()} unit="件" />
            <KpiCard label="锁定库存" value={metrics.lockedQty.toLocaleString()} unit="件" tone={metrics.lockedQty > 0 ? "warning" : "muted"} />
            <KpiCard label="可用库存" value={metrics.availableQty.toLocaleString()} unit="件" tone="success" />
          </KpiGrid>
        }
        filters={
          <div className="space-y-4">
            <Tabs value={view} onValueChange={(value) => setView(value as ViewType)} className="w-full overflow-x-auto pb-1">
              <TabsList className="w-max">
                {(Object.entries(viewConfigs) as [ViewType, typeof viewConfigs[ViewType]][]).map(([key, config]) => (
                  <TabsTrigger
                    key={key}
                    value={key}
                    className="group gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    {config.label}
                    <span className="text-xs font-normal text-muted-foreground group-data-[state=active]:text-primary-foreground/80 xl:inline">
                      ({config.scope})
                    </span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              <div className="relative min-w-0 flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="搜索SKU、商品名称、批次号或库位" className="pl-9" />
              </div>
              <Select value={owner} onValueChange={setOwner}>
                <SelectTrigger className="w-full lg:w-[180px]"><SelectValue placeholder="货主" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部货主</SelectItem>
                  <SelectItem value="维他很忙">维他很忙</SelectItem>
                  <SelectItem value="跨境小王">跨境小王</SelectItem>
                </SelectContent>
              </Select>
              <Select value={warehouse} onValueChange={setWarehouse}>
                <SelectTrigger className="w-full lg:w-[180px]"><SelectValue placeholder="仓库" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部仓库</SelectItem>
                  <SelectItem value="洛杉矶仓">洛杉矶仓</SelectItem>
                  <SelectItem value="安大略仓">安大略仓</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={resetFilters}><RefreshCcw className="mr-2 h-4 w-4" />重置</Button>
            </div>
          </div>
        }
        table={
          <DataTableShell
            title={
              <div className="flex items-center gap-2">
                <Layers3 className="h-4 w-4 text-primary" />
                {viewConfigs[view].label}
                <Badge variant="outline">{viewConfigs[view].scope}</Badge>
              </div>
            }
            description={viewConfigs[view].description}
            pagination={
              viewRows.length > 0 ? (
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>共 {viewRows.length} 条，当前显示全部结果</span>
                  <span>实际库存 = 锁定库存 + 可用库存</span>
                </div>
              ) : null
            }
          >
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <DataTableHeaderRow>
                    <TableHead>货主</TableHead>
                    <TableHead>仓库</TableHead>
                    {renderDimensionHeaders()}
                    <TableHead className="text-right">实际库存</TableHead>
                    <TableHead className="text-right">锁定库存</TableHead>
                    <TableHead className="text-right">可用库存</TableHead>
                    {view === "sku" ? <TableHead className="text-right">操作</TableHead> : null}
                  </DataTableHeaderRow>
                </TableHeader>
                <TableBody>
                  {viewRows.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.owner}</TableCell>
                      <TableCell>{row.warehouse}</TableCell>
                      {renderDimensionCells(row)}
                      <QuantityCell value={row.actualQty} />
                      <QuantityCell value={row.lockedQty} tone="locked" />
                      <QuantityCell value={row.availableQty} tone="available" />
                      {view === "sku" ? (
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => onNavigate(`/inventory/detail/${row.sku}`)}>
                            查看明细
                          </Button>
                        </TableCell>
                      ) : null}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {viewRows.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                <Package className="mb-3 h-12 w-12 opacity-20" />
                <p className="font-medium">暂无匹配库存</p>
                <p className="mt-1 text-sm">请调整关键词、货主或仓库筛选条件</p>
              </div>
            ) : null}
          </DataTableShell>
        }
      />
    </WMSLayout>
  );
}
