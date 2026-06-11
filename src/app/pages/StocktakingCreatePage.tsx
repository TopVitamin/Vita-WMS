import { useState } from "react";
import { toast } from "sonner";
import { WMSLayout } from "../components/layouts/WMSLayout";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Switch } from "../components/ui/switch";
import { Badge } from "../components/ui/badge";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import {
  ArrowLeft, Save, Calendar, Users, MapPin, Package
} from "lucide-react";

interface StocktakingCreatePageProps {
  onNavigate: (path: string) => void;
}

export default function StocktakingCreatePage({ onNavigate }: StocktakingCreatePageProps) {
  const [formData, setFormData] = useState({
    planName: "",
    stocktakingType: "全盘",
    rangeType: "all",
    selectedZones: [] as string[],
    planStartTime: "",
    planEndTime: "",
    supervisor: "",
    counters: [] as string[],
    reviewer: "",
    includeZeroStock: false,
    includeFrozen: false,
    blindCount: false,
    allowRecount: false,
    freezeStock: false,
    diffHandling: "submit",
    notes: "",
  });

  const updateField = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSave = () => {
    toast.success("盘点计划创建成功");
    onNavigate("/inventory/stocktaking");
  };

  return (
    <WMSLayout title="创建盘点计划" currentPath="/inventory/stocktaking" onNavigate={onNavigate}>
      <div className="p-6 space-y-4">
        {/* 顶部操作栏 */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => onNavigate("/inventory/stocktaking")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回
          </Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            创建盘点计划
          </Button>
        </div>

        <div className="grid grid-cols-12 gap-4">
          {/* 左侧表单 */}
          <div className="col-span-8 space-y-4">
            {/* 基本信息 */}
            <Card>
              <CardHeader>
                <CardTitle>基本信息</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>盘点名称 <span className="text-error-500">*</span></Label>
                  <Input
                    placeholder="例如：2026年6月全库盘点"
                    value={formData.planName}
                    onChange={(e) => updateField("planName", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>盘点类型 <span className="text-error-500">*</span></Label>
                  <Select value={formData.stocktakingType} onValueChange={(val) => updateField("stocktakingType", val)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="全盘">全盘 - 盘点全部库存</SelectItem>
                      <SelectItem value="抽盘">抽盘 - 随机抽样盘点</SelectItem>
                      <SelectItem value="循环盘">循环盘 - 按周期循环盘点</SelectItem>
                      <SelectItem value="动态盘">动态盘 - 根据业务动态触发</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>计划开始时间 <span className="text-error-500">*</span></Label>
                    <Input
                      type="datetime-local"
                      value={formData.planStartTime}
                      onChange={(e) => updateField("planStartTime", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>计划结束时间</Label>
                    <Input
                      type="datetime-local"
                      value={formData.planEndTime}
                      onChange={(e) => updateField("planEndTime", e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 盘点范围 */}
            <Card>
              <CardHeader>
                <CardTitle>盘点范围</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <RadioGroup value={formData.rangeType} onValueChange={(val) => updateField("rangeType", val)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="all" id="all" />
                    <Label htmlFor="all">全库盘点</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="zones" id="zones" />
                    <Label htmlFor="zones">指定库区</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="locations" id="locations" />
                    <Label htmlFor="locations">指定库位</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="skus" id="skus" />
                    <Label htmlFor="skus">指定SKU</Label>
                  </div>
                </RadioGroup>

                {formData.rangeType === "zones" && (
                  <div className="space-y-2">
                    <Label>选择库区</Label>
                    <div className="grid grid-cols-4 gap-2">
                      {["A库区", "B库区", "C库区", "D库区"].map((zone) => (
                        <Button
                          key={zone}
                          variant={formData.selectedZones.includes(zone) ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            const zones = formData.selectedZones.includes(zone)
                              ? formData.selectedZones.filter(z => z !== zone)
                              : [...formData.selectedZones, zone];
                            updateField("selectedZones", zones);
                          }}
                        >
                          {zone}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <Label>包含零库存库位</Label>
                  <Switch
                    checked={formData.includeZeroStock}
                    onCheckedChange={(checked) => updateField("includeZeroStock", checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <Label>包含冻结库存</Label>
                  <Switch
                    checked={formData.includeFrozen}
                    onCheckedChange={(checked) => updateField("includeFrozen", checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* 盘点人员 */}
            <Card>
              <CardHeader>
                <CardTitle>盘点人员</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>盘点负责人 <span className="text-error-500">*</span></Label>
                  <Select value={formData.supervisor} onValueChange={(val) => updateField("supervisor", val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择负责人" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="张三">张三</SelectItem>
                      <SelectItem value="李四">李四</SelectItem>
                      <SelectItem value="王五">王五</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>盘点员 <span className="text-error-500">*</span></Label>
                  <div className="flex gap-2">
                    {["张三", "李四", "王五", "赵六"].map((person) => (
                      <Button
                        key={person}
                        variant={formData.counters.includes(person) ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          const counters = formData.counters.includes(person)
                            ? formData.counters.filter(p => p !== person)
                            : [...formData.counters, person];
                          updateField("counters", counters);
                        }}
                      >
                        {person}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>审核人 <span className="text-error-500">*</span></Label>
                  <Select value={formData.reviewer} onValueChange={(val) => updateField("reviewer", val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择审核人" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="王五">王五</SelectItem>
                      <SelectItem value="系统管理员">系统管理员</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* 盘点规则 */}
            <Card>
              <CardHeader>
                <CardTitle>盘点规则</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>差异处理方式</Label>
                  <Select value={formData.diffHandling} onValueChange={(val) => updateField("diffHandling", val)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">自动调整</SelectItem>
                      <SelectItem value="submit">提交审核</SelectItem>
                      <SelectItem value="manual">手动处理</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <Label>允许盲盘</Label>
                    <p className="text-xs text-muted-foreground">不显示账面库存数量</p>
                  </div>
                  <Switch
                    checked={formData.blindCount}
                    onCheckedChange={(checked) => updateField("blindCount", checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <Label>允许重复盘点</Label>
                    <p className="text-xs text-muted-foreground">支持二次复盘</p>
                  </div>
                  <Switch
                    checked={formData.allowRecount}
                    onCheckedChange={(checked) => updateField("allowRecount", checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <Label>盘点期间冻结库存</Label>
                    <p className="text-xs text-muted-foreground">禁止出入库操作</p>
                  </div>
                  <Switch
                    checked={formData.freezeStock}
                    onCheckedChange={(checked) => updateField("freezeStock", checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 右侧侧边栏 */}
          <div className="col-span-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">盘点信息摘要</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">盘点类型：</span>
                  <Badge variant="outline">{formData.stocktakingType}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">盘点范围：</span>
                  <span>
                    {formData.rangeType === "all" && "全库"}
                    {formData.rangeType === "zones" && `${formData.selectedZones.length}个库区`}
                    {formData.rangeType === "locations" && "指定库位"}
                    {formData.rangeType === "skus" && "指定SKU"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">负责人：</span>
                  <span>{formData.supervisor || "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">盘点员：</span>
                  <span>{formData.counters.length}人</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">审核人：</span>
                  <span>{formData.reviewer || "-"}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">备注</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="输入盘点备注信息..."
                  rows={6}
                  value={formData.notes}
                  onChange={(e) => updateField("notes", e.target.value)}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </WMSLayout>
  );
}
