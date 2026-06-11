import { useState } from "react";
import { WMSLayout } from "../components/layouts/WMSLayout";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { ConfirmActionDialog, DataTableHeaderRow, StatusBadge } from "../components/business";
import { enabledStatusMap } from "../configs/wmsStatusMap";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Checkbox } from "../components/ui/checkbox";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Switch } from "../components/ui/switch";
import { 
  Search, Plus, Filter, Download, Upload, Edit, Trash2, Building2, 
  Mail, Phone, User, MapPin, Calendar
} from "lucide-react";

interface CustomerManagementPageProps {
  onNavigate: (path: string) => void;
}

export default function CustomerManagementPage({ onNavigate }: CustomerManagementPageProps) {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<any>(null);
  const [deleteCustomerId, setDeleteCustomerId] = useState<string | null>(null);

  // 模拟数据
  const customerData = [
    {
      customerId: "CUST-001",
      customerName: "Amazon US",
      customerCode: "AMZ-US",
      contactPerson: "John Smith",
      contactPhone: "+1 206-555-0123",
      contactEmail: "john.smith@amazon.com",
      address: "410 Terry Avenue North, Seattle, WA 98109",
      country: "美国",
      totalSKUs: 2580,
      totalInventory: 125000,
      status: "启用",
      createTime: "2023-05-15",
      lastOrderTime: "2024-10-27",
    },
    {
      customerId: "CUST-002",
      customerName: "eBay UK",
      customerCode: "EBAY-UK",
      contactPerson: "Sarah Johnson",
      contactPhone: "+44 20 7660 1234",
      contactEmail: "sarah.j@ebay.co.uk",
      address: "1 More London Place, London SE1 2AF",
      country: "英国",
      totalSKUs: 1840,
      totalInventory: 89000,
      status: "启用",
      createTime: "2023-06-20",
      lastOrderTime: "2024-10-26",
    },
    {
      customerId: "CUST-003",
      customerName: "Walmart Canada",
      customerCode: "WMT-CA",
      contactPerson: "Michael Brown",
      contactPhone: "+1 905-555-4567",
      contactEmail: "m.brown@walmart.ca",
      address: "1940 Argentia Road, Mississauga, ON L5N 1P9",
      country: "加拿大",
      totalSKUs: 1520,
      totalInventory: 72000,
      status: "启用",
      createTime: "2023-07-10",
      lastOrderTime: "2024-10-28",
    },
    {
      customerId: "CUST-004",
      customerName: "Shopify Merchants",
      customerCode: "SHOP-001",
      contactPerson: "Emily Chen",
      contactPhone: "+1 613-555-7890",
      contactEmail: "emily.chen@shopify.com",
      address: "150 Elgin Street, Ottawa, ON K2P 1L4",
      country: "加拿大",
      totalSKUs: 980,
      totalInventory: 45000,
      status: "启用",
      createTime: "2023-08-22",
      lastOrderTime: "2024-10-25",
    },
    {
      customerId: "CUST-005",
      customerName: "Target Australia",
      customerCode: "TGT-AU",
      contactPerson: "David Wilson",
      contactPhone: "+61 3 9281 1234",
      contactEmail: "d.wilson@target.com.au",
      address: "123 Collins Street, Melbourne VIC 3000",
      country: "澳大利亚",
      totalSKUs: 750,
      totalInventory: 32000,
      status: "停用",
      createTime: "2023-04-18",
      lastOrderTime: "2024-09-15",
    },
    {
      customerId: "CUST-006",
      customerName: "Zalando Germany",
      customerCode: "ZAL-DE",
      contactPerson: "Anna Schmidt",
      contactPhone: "+49 30 2759 4600",
      contactEmail: "anna.schmidt@zalando.de",
      address: "Valeska-Gert-Straße 5, 10243 Berlin",
      country: "德国",
      totalSKUs: 2100,
      totalInventory: 95000,
      status: "启用",
      createTime: "2023-09-05",
      lastOrderTime: "2024-10-28",
    },
  ];

  const handleNavigate = (path: string) => {
    onNavigate(path);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(customerData.map((_, index) => `customer-${index}`));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (index: number) => {
    const itemId = `customer-${index}`;
    setSelectedItems((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
  };

  const handleEdit = (customer: any) => {
    setEditingCustomer(customer);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (customerId: string) => {
    setDeleteCustomerId(customerId);
  };

  const confirmDeleteCustomer = () => {
    if (deleteCustomerId) toast.success(`客户 ${deleteCustomerId} 已删除`);
    setDeleteCustomerId(null);
  };

  return (
    <WMSLayout title="客户管理" currentPath="/master-data/customers" onNavigate={handleNavigate}>
      <div className="p-6 space-y-6">
        {/* 操作栏 */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="搜索客户名称/编码/联系人..." 
                className="pl-9 w-80" 
              />
            </div>
            
            <Select>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="客户状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="active">启用</SelectItem>
                <SelectItem value="inactive">停用</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="国家/地区" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部国家</SelectItem>
                <SelectItem value="us">美国</SelectItem>
                <SelectItem value="uk">英国</SelectItem>
                <SelectItem value="ca">加拿大</SelectItem>
                <SelectItem value="au">澳大利亚</SelectItem>
                <SelectItem value="de">德国</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              更多筛选
            </Button>
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <Button variant="outline" size="sm">
              <Upload className="w-4 h-4 mr-2" />
              导入
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              导出
            </Button>
            <Button size="sm" onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              新增客户
            </Button>
          </div>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-4 gap-4">
          <div className="border rounded-lg p-4 bg-card">
            <div className="text-sm text-muted-foreground mb-1">客户总数</div>
            <div className="text-2xl">{customerData.length}</div>
          </div>
          <div className="border rounded-lg p-4 bg-card">
            <div className="text-sm text-muted-foreground mb-1">启用客户</div>
            <div className="text-2xl text-success-600">
              {customerData.filter(c => c.status === "启用").length}
            </div>
          </div>
          <div className="border rounded-lg p-4 bg-card">
            <div className="text-sm text-muted-foreground mb-1">总SKU数</div>
            <div className="text-2xl">
              {customerData.reduce((sum, c) => sum + c.totalSKUs, 0).toLocaleString()}
            </div>
          </div>
          <div className="border rounded-lg p-4 bg-card">
            <div className="text-sm text-muted-foreground mb-1">总库存量</div>
            <div className="text-2xl">
              {customerData.reduce((sum, c) => sum + c.totalInventory, 0).toLocaleString()}
            </div>
          </div>
        </div>

        {/* 批量操作提示 */}
        {selectedItems.length > 0 && (
          <div className="flex items-center justify-between p-4 bg-primary/5 border border-primary/20 rounded-lg">
            <span className="text-sm">
              已选择 <span className="font-mono mx-1">{selectedItems.length}</span> 个客户
            </span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">批量启用</Button>
              <Button variant="outline" size="sm">批量停用</Button>
              <Button variant="outline" size="sm">批量删除</Button>
            </div>
          </div>
        )}

        {/* 表格 */}
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <DataTableHeaderRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedItems.length === customerData.length}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>客户编码</TableHead>
                <TableHead>客户名称</TableHead>
                <TableHead>联系人</TableHead>
                <TableHead>联系方式</TableHead>
                <TableHead>国家/地区</TableHead>
                <TableHead className="text-right">SKU数</TableHead>
                <TableHead className="text-right">库存量</TableHead>
                <TableHead>最后下单</TableHead>
                <TableHead>状态</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </DataTableHeaderRow>
            </TableHeader>
            <TableBody>
              {customerData.map((customer, index) => (
                <TableRow
                  key={customer.customerId}
                  className={`hover:bg-table-row-hover transition-colors ${selectedItems.includes(`customer-${index}`) ? "bg-table-row-hover" : ""}`}
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedItems.includes(`customer-${index}`)}
                      onCheckedChange={() => handleSelectItem(index)}
                    />
                  </TableCell>
                  <TableCell>
                    <code className="text-sm font-mono text-primary">{customer.customerCode}</code>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
                        <Building2 className="w-4 h-4 text-primary" />
                      </div>
                      <span>{customer.customerName}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <User className="w-3 h-3 text-muted-foreground" />
                      {customer.contactPerson}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Phone className="w-3 h-3" />
                        {customer.contactPhone}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Mail className="w-3 h-3" />
                        {customer.contactEmail}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="gap-1">
                      <MapPin className="w-3 h-3" />
                      {customer.country}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {customer.totalSKUs.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {customer.totalInventory.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {customer.lastOrderTime}
                  </TableCell>
                  <TableCell>
                    <StatusBadge {...enabledStatusMap[customer.status]} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEdit(customer)}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDelete(customer.customerId)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* 分页 */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            共 {customerData.length} 条记录
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>上一页</Button>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm" className="min-w-[36px]">1</Button>
            </div>
            <Button variant="outline" size="sm" disabled>下一页</Button>
          </div>
        </div>
      </div>

      {/* 新增客户对话框 */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>新增客户</DialogTitle>
            <DialogDescription>
              填写客户基本信息，创建新的客户档案
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="customerCode">客户编码 *</Label>
              <Input id="customerCode" placeholder="例如：AMZ-US" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customerName">客户名称 *</Label>
              <Input id="customerName" placeholder="例如：Amazon US" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactPerson">联系人 *</Label>
              <Input id="contactPerson" placeholder="联系人姓名" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactPhone">联系电话 *</Label>
              <Input id="contactPhone" placeholder="+1 xxx-xxx-xxxx" />
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="contactEmail">联系邮箱 *</Label>
              <Input id="contactEmail" type="email" placeholder="email@example.com" />
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="address">地址</Label>
              <Textarea id="address" placeholder="详细地址" rows={2} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">国家/地区 *</Label>
              <Select>
                <SelectTrigger id="country">
                  <SelectValue placeholder="选择国家" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="us">美国</SelectItem>
                  <SelectItem value="uk">英国</SelectItem>
                  <SelectItem value="ca">加拿大</SelectItem>
                  <SelectItem value="au">澳大利亚</SelectItem>
                  <SelectItem value="de">德国</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">状态</Label>
              <div className="flex items-center space-x-2 h-10">
                <Switch id="status" defaultChecked />
                <Label htmlFor="status">启用</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={() => setIsAddDialogOpen(false)}>
              确认新增
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 编辑客户对话框 */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>编辑客户</DialogTitle>
            <DialogDescription>
              修改客户基本信息
            </DialogDescription>
          </DialogHeader>
          {editingCustomer && (
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-customerCode">客户编码 *</Label>
                <Input 
                  id="edit-customerCode" 
                  defaultValue={editingCustomer.customerCode}
                  disabled
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-customerName">客户名称 *</Label>
                <Input 
                  id="edit-customerName" 
                  defaultValue={editingCustomer.customerName}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-contactPerson">联系人 *</Label>
                <Input 
                  id="edit-contactPerson" 
                  defaultValue={editingCustomer.contactPerson}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-contactPhone">联系电话 *</Label>
                <Input 
                  id="edit-contactPhone" 
                  defaultValue={editingCustomer.contactPhone}
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="edit-contactEmail">联系邮箱 *</Label>
                <Input 
                  id="edit-contactEmail" 
                  type="email" 
                  defaultValue={editingCustomer.contactEmail}
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="edit-address">地址</Label>
                <Textarea 
                  id="edit-address" 
                  defaultValue={editingCustomer.address}
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-country">国家/地区 *</Label>
                <Select defaultValue={editingCustomer.country}>
                  <SelectTrigger id="edit-country">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="美国">美国</SelectItem>
                    <SelectItem value="英国">英国</SelectItem>
                    <SelectItem value="加拿大">加拿大</SelectItem>
                    <SelectItem value="澳大利亚">澳大利亚</SelectItem>
                    <SelectItem value="德国">德国</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status">状态</Label>
                <div className="flex items-center space-x-2 h-10">
                  <Switch 
                    id="edit-status" 
                    defaultChecked={editingCustomer.status === "启用"}
                  />
                  <Label htmlFor="edit-status">启用</Label>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={() => setIsEditDialogOpen(false)}>
              保存修改
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmActionDialog
        destructive
        confirmLabel="确认删除"
        description="删除客户会影响客户资料、SKU归属和历史单据查询。当前演示环境仅展示删除确认流程。"
        onConfirm={confirmDeleteCustomer}
        onOpenChange={(open) => {
          if (!open) setDeleteCustomerId(null);
        }}
        open={Boolean(deleteCustomerId)}
        title="删除客户"
      />
    </WMSLayout>
  );
}
