import { useMemo, useState } from "react";
import {
  BatchActionBar,
  DataTableShell,
  FilterBar,
  KpiCard,
  KpiGrid,
  ListPageLayout,
  PageHeader,
  StatusBadge,
} from "../components/business";
import { Button } from "../components/ui/button";
import { Checkbox } from "../components/ui/checkbox";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import type { DesignStatusTone } from "../types/design-system";

type TemplateStatus = "待处理" | "处理中" | "已完成" | "已关闭";

interface TemplateRecord {
  id: string;
  code: string;
  name: string;
  owner: string;
  quantity: number;
  status: TemplateStatus;
  updatedAt: string;
}

const templateStatusMap: Record<TemplateStatus, { label: string; tone: DesignStatusTone }> = {
  待处理: { label: "待处理", tone: "warning" },
  处理中: { label: "处理中", tone: "primary" },
  已完成: { label: "已完成", tone: "success" },
  已关闭: { label: "已关闭", tone: "muted" },
};

const templateRows: TemplateRecord[] = [
  {
    id: "1",
    code: "DEMO-001",
    name: "示例业务对象 A",
    owner: "运营一组",
    quantity: 120,
    status: "待处理",
    updatedAt: "2026-06-02 09:30",
  },
  {
    id: "2",
    code: "DEMO-002",
    name: "示例业务对象 B",
    owner: "运营二组",
    quantity: 86,
    status: "处理中",
    updatedAt: "2026-06-02 10:15",
  },
  {
    id: "3",
    code: "DEMO-003",
    name: "示例业务对象 C",
    owner: "运营三组",
    quantity: 45,
    status: "已完成",
    updatedAt: "2026-06-02 11:00",
  },
];

export function ListPageTemplate() {
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState<TemplateStatus | "全部">("全部");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filteredRows = useMemo(() => {
    return templateRows.filter((row) => {
      const matchesKeyword = !keyword || row.code.includes(keyword) || row.name.includes(keyword);
      const matchesStatus = status === "全部" || row.status === status;
      return matchesKeyword && matchesStatus;
    });
  }, [keyword, status]);

  const toggleSelected = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  return (
    <ListPageLayout
      header={
        <PageHeader
          title="标准列表页模板"
          description="复制此模板创建 ERP、SRM、OMMS 等后台对象管理页。"
          actions={<Button>新增对象</Button>}
        />
      }
      kpis={
        <KpiGrid columns={4}>
          <KpiCard label="总数" value={templateRows.length} />
          <KpiCard label="待处理" value={templateRows.filter((row) => row.status === "待处理").length} tone="warning" />
          <KpiCard label="处理中" value={templateRows.filter((row) => row.status === "处理中").length} tone="primary" />
          <KpiCard label="已完成" value={templateRows.filter((row) => row.status === "已完成").length} tone="success" />
        </KpiGrid>
      }
      filters={
        <FilterBar>
          <Input value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="搜索编码或名称" />
          <Select value={status} onValueChange={(value) => setStatus(value as TemplateStatus | "全部")}>
            <SelectTrigger>
              <SelectValue placeholder="状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="全部">全部状态</SelectItem>
              <SelectItem value="待处理">待处理</SelectItem>
              <SelectItem value="处理中">处理中</SelectItem>
              <SelectItem value="已完成">已完成</SelectItem>
              <SelectItem value="已关闭">已关闭</SelectItem>
            </SelectContent>
          </Select>
        </FilterBar>
      }
      batchActions={
        <BatchActionBar selectedCount={selectedIds.length}>
          <Button size="sm" variant="outline">
            批量导出
          </Button>
          <Button size="sm">批量处理</Button>
        </BatchActionBar>
      }
      table={
        <DataTableShell
          title="对象列表"
          description="表格字段、状态映射和操作列应按新系统业务对象替换。"
          pagination={<div className="text-sm text-muted-foreground">共 {filteredRows.length} 条</div>}
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12" />
                <TableHead>编码</TableHead>
                <TableHead>名称</TableHead>
                <TableHead>负责人</TableHead>
                <TableHead className="text-right">数量</TableHead>
                <TableHead className="text-center">状态</TableHead>
                <TableHead>更新时间</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <Checkbox checked={selectedIds.includes(row.id)} onCheckedChange={() => toggleSelected(row.id)} />
                  </TableCell>
                  <TableCell className="font-mono text-sm">{row.code}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.owner}</TableCell>
                  <TableCell className="text-right">{row.quantity}</TableCell>
                  <TableCell className="text-center">
                    <StatusBadge {...templateStatusMap[row.status]} />
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{row.updatedAt}</TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="ghost">
                      查看
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DataTableShell>
      }
    />
  );
}
