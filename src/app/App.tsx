import { FormEvent, ReactElement, ReactNode, useState } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from "react-router";
import { ArrowRight, Lock, PackageCheck, ShieldCheck, UserPlus, Warehouse } from "lucide-react";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";

import ArrivalScanPage from "./pages/ArrivalScanPage";
import ContainerManagementPage from "./pages/ContainerManagementPage";
import CustomerManagementPage from "./pages/CustomerManagementPage";
import DashboardPage from "./pages/DashboardPage";
import DesignSystemPreviewPage from "./pages/DesignSystemPreviewPage";
import InboundDetailPage from "./pages/InboundDetailPage";
import InboundInspectionPage from "./pages/InboundInspectionPage";
import InboundListPage from "./pages/InboundListPage";
import InventoryAdjustmentPage from "./pages/InventoryAdjustmentPage";
import InventoryDetailPage from "./pages/InventoryDetailPage";
import InventoryQueryPage from "./pages/InventoryQueryPage";
import InventoryTransactionPage from "./pages/InventoryTransactionPage";
import InventoryTransferPage from "./pages/InventoryTransferPage";
import InventoryTransferWorkspacePage from "./pages/InventoryTransferWorkspacePage";
import LocationManagementPage from "./pages/LocationManagementPage";
import OutboundCheckPage from "./pages/OutboundCheckPage";
import OutboundDetailPage from "./pages/OutboundDetailPage";
import OutboundListPage from "./pages/OutboundListPage";
import OutboundShippingPage from "./pages/OutboundShippingPage";
import PackingTaskListPage from "./pages/PackingTaskListPage";
import PackingWorkspacePage from "./pages/PackingWorkspacePage";
import PickingTaskDetailPage from "./pages/PickingTaskDetailPage";
import PickingTaskListPage from "./pages/PickingTaskListPage";
import PickingWorkspacePage from "./pages/PickingWorkspacePage";
import ProductMasterDataPage from "./pages/ProductMasterDataPage";
import PutawayDetailPage from "./pages/PutawayDetailPage";
import PutawayListPage from "./pages/PutawayListPage";
import ReplenishmentManagementPage from "./pages/ReplenishmentManagementPage";
import InboundReportPage from "./pages/reports/InboundReportPage";
import InventoryReportPage from "./pages/reports/InventoryReportPage";
import OutboundReportPage from "./pages/reports/OutboundReportPage";
import ProductivityReportPage from "./pages/reports/ProductivityReportPage";
import SeedingOperationPage from "./pages/SeedingOperationPage";
import SeedingWallManagementPage from "./pages/SeedingWallManagementPage";
import SKUFormPage from "./pages/SKUFormPage";
import SKUListPage from "./pages/SKUListPage";
import StocktakingCreatePage from "./pages/StocktakingCreatePage";
import StocktakingDetailPage from "./pages/StocktakingDetailPage";
import StocktakingPlanListPage from "./pages/StocktakingPlanListPage";
import StocktakingWorkspacePage from "./pages/StocktakingWorkspacePage";
import WaveDetailPage from "./pages/WaveDetailPage";
import WaveListPage from "./pages/WaveListPage";
import ZoneManagementPage from "./pages/ZoneManagementPage";


type NavigateHandler = (path: string) => void;
type RoutedPageComponent = (props: { onNavigate: NavigateHandler }) => ReactElement;

interface AuthScreenProps {
  initialTab: "login" | "register";
  onAuthenticated: () => void;
}

function AuthScreen({ initialTab, onAuthenticated }: AuthScreenProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onAuthenticated();
  };

  return (
    <main className="min-h-screen bg-muted/30 flex flex-col items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-[420px] space-y-8">
        <div className="flex flex-col items-center space-y-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary shadow-sm text-primary-foreground">
            <Warehouse className="h-7 w-7" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Vita-WMS</h1>
            <p className="text-sm text-muted-foreground mt-1">跨境电商海外仓作业演示系统</p>
          </div>
        </div>

        <Card className="shadow-lg border-muted/60">
          <CardContent className="pt-6">
            <Tabs defaultValue={initialTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">登录</TabsTrigger>
                <TabsTrigger value="register">注册</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div className="space-y-2">
                    <Label htmlFor="login-account">账号</Label>
                    <Input id="login-account" defaultValue="demo@baoxia-wms.com" className="h-10" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="login-password">密码</Label>
                      <a href="#" className="text-xs text-primary hover:underline" onClick={(e) => e.preventDefault()}>忘记密码?</a>
                    </div>
                    <Input id="login-password" type="password" defaultValue="demo123456" className="h-10" />
                  </div>
                  <Button className="w-full h-10 mt-2" type="submit">
                    进入工作台
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register">
                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div className="space-y-2">
                    <Label htmlFor="register-name">姓名</Label>
                    <Input id="register-name" placeholder="例如：海外仓运营" className="h-10" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-email">邮箱</Label>
                    <Input id="register-email" type="email" placeholder="name@example.com" className="h-10" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-password">密码</Label>
                    <Input id="register-password" type="password" placeholder="至少 8 位" className="h-10" />
                  </div>
                  <Button className="w-full h-10 mt-2" type="submit">
                    注册并进入工作台
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground px-8 leading-relaxed">
          点击进入工作台即表示您同意我们的
          <a href="#" className="underline underline-offset-4 hover:text-primary mx-1" onClick={(e) => e.preventDefault()}>服务条款</a>
          和
          <a href="#" className="underline underline-offset-4 hover:text-primary mx-1" onClick={(e) => e.preventDefault()}>隐私政策</a>。
        </p>
      </div>
    </main>
  );
}

function LoginRoute({
  initialTab,
  isAuthenticated,
  onAuthenticated,
}: {
  initialTab: "login" | "register";
  isAuthenticated: boolean;
  onAuthenticated: () => void;
}) {
  const navigate = useNavigate();
  const location = useLocation();

  if (isAuthenticated) return <Navigate to="/" replace />;

  const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname || "/";
  return (
    <AuthScreen
      initialTab={initialTab}
      onAuthenticated={() => {
        onAuthenticated();
        navigate(from, { replace: true });
      }}
    />
  );
}

function ProtectedRoute({ isAuthenticated, children }: { isAuthenticated: boolean; children: ReactNode }) {
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}

function RoutePage({ component: Component, onLogout }: { component: RoutedPageComponent; onLogout: () => void }) {
  const navigate = useNavigate();
  const handleNavigate = createNavigateHandler(navigate, onLogout);
  return <Component onNavigate={handleNavigate} />;
}

function InventoryDetailRoute({ onLogout }: { onLogout: () => void }) {
  const navigate = useNavigate();
  const { skuCode } = useParams();
  return <InventoryDetailPage skuCode={skuCode} onNavigate={createNavigateHandler(navigate, onLogout)} />;
}

function PickingTaskDetailRoute({ onLogout }: { onLogout: () => void }) {
  const navigate = useNavigate();
  const { taskId } = useParams();
  return <PickingTaskDetailPage taskId={taskId} onNavigate={createNavigateHandler(navigate, onLogout)} />;
}

function StocktakingDetailRoute({ onLogout }: { onLogout: () => void }) {
  const navigate = useNavigate();
  const { planId } = useParams();
  return <StocktakingDetailPage planId={planId} onNavigate={createNavigateHandler(navigate, onLogout)} />;
}

function PutawayDetailRoute({ onLogout }: { onLogout: () => void }) {
  const navigate = useNavigate();
  const { putawayNo } = useParams();
  return <PutawayDetailPage putawayNo={putawayNo} onNavigate={createNavigateHandler(navigate, onLogout)} />;
}

function SkuFormRoute({ onLogout }: { onLogout: () => void }) {
  const navigate = useNavigate();
  const { skuId } = useParams();
  return <SKUFormPage skuId={skuId} onNavigate={createNavigateHandler(navigate, onLogout)} />;
}

function createNavigateHandler(navigate: ReturnType<typeof useNavigate>, onLogout: () => void): NavigateHandler {
  return (path: string) => {
    if (path === "/logout") {
      onLogout();
      navigate("/login", { replace: true });
      return;
    }

    navigate(path);
  };
}

function AppRoutes() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => sessionStorage.getItem("vita-wms-auth") === "true");
  const authenticate = () => {
    sessionStorage.setItem("vita-wms-auth", "true");
    setIsAuthenticated(true);
  };
  const logout = () => {
    sessionStorage.removeItem("vita-wms-auth");
    setIsAuthenticated(false);
  };
  const protectedPage = (component: RoutedPageComponent) => (
    <ProtectedRoute isAuthenticated={isAuthenticated}>
      <RoutePage component={component} onLogout={logout} />
    </ProtectedRoute>
  );

  return (
    <Routes>
      <Route
        path="/login"
        element={
          <LoginRoute
            initialTab="login"
            isAuthenticated={isAuthenticated}
            onAuthenticated={authenticate}
          />
        }
      />
      <Route
        path="/register"
        element={
          <LoginRoute
            initialTab="register"
            isAuthenticated={isAuthenticated}
            onAuthenticated={authenticate}
          />
        }
      />
      <Route path="/" element={protectedPage(DashboardPage)} />
      <Route path="/design-system" element={protectedPage(DesignSystemPreviewPage)} />
      <Route path="/inbound/arrival-scan" element={protectedPage(ArrivalScanPage as RoutedPageComponent)} />
      <Route path="/inbound/management" element={protectedPage(InboundListPage as RoutedPageComponent)} />
      <Route path="/inbound/detail" element={protectedPage(InboundDetailPage as RoutedPageComponent)} />
      <Route path="/inbound/inspection" element={protectedPage(InboundInspectionPage)} />
      <Route path="/putaway/management" element={protectedPage(PutawayListPage as RoutedPageComponent)} />
      <Route
        path="/putaway/detail/:putawayNo"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <PutawayDetailRoute onLogout={logout} />
          </ProtectedRoute>
        }
      />
      <Route path="/outbound/management" element={protectedPage(OutboundListPage as RoutedPageComponent)} />
      <Route path="/outbound/detail" element={protectedPage(OutboundDetailPage as RoutedPageComponent)} />
      <Route path="/wave/management" element={protectedPage(WaveListPage as RoutedPageComponent)} />
      <Route path="/wave/detail" element={protectedPage(WaveDetailPage as RoutedPageComponent)} />
      <Route path="/outbound/seeding" element={protectedPage(SeedingOperationPage as RoutedPageComponent)} />
      <Route path="/outbound/check" element={protectedPage(OutboundCheckPage as RoutedPageComponent)} />
      <Route path="/outbound/shipping" element={protectedPage(OutboundShippingPage as RoutedPageComponent)} />
      <Route path="/picking/tasks" element={protectedPage(PickingTaskListPage)} />
      <Route
        path="/picking/tasks/:taskId"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <PickingTaskDetailRoute onLogout={logout} />
          </ProtectedRoute>
        }
      />
      <Route path="/picking/workspace" element={protectedPage(PickingWorkspacePage)} />
      <Route path="/packing/tasks" element={protectedPage(PackingTaskListPage)} />
      <Route path="/packing/workspace" element={protectedPage(PackingWorkspacePage)} />
      <Route path="/inventory/query" element={protectedPage(InventoryQueryPage)} />
      <Route
        path="/inventory/detail/:skuCode"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <InventoryDetailRoute onLogout={logout} />
          </ProtectedRoute>
        }
      />
      <Route path="/inventory/transaction" element={protectedPage(InventoryTransactionPage as RoutedPageComponent)} />
      <Route path="/inventory/transfer" element={protectedPage(InventoryTransferPage as RoutedPageComponent)} />
      <Route path="/inventory/transfer/workspace" element={protectedPage(InventoryTransferWorkspacePage)} />
      <Route path="/inventory/adjustment" element={protectedPage(InventoryAdjustmentPage as RoutedPageComponent)} />
      <Route path="/inventory/replenishment" element={protectedPage(ReplenishmentManagementPage as RoutedPageComponent)} />
      <Route path="/inventory/stocktaking" element={protectedPage(StocktakingPlanListPage)} />
      <Route path="/inventory/stocktaking/create" element={protectedPage(StocktakingCreatePage)} />
      <Route path="/inventory/stocktaking/workspace" element={protectedPage(StocktakingWorkspacePage)} />
      <Route
        path="/inventory/stocktaking/:planId"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <StocktakingDetailRoute onLogout={logout} />
          </ProtectedRoute>
        }
      />
      <Route path="/reports/inbound" element={protectedPage(InboundReportPage as RoutedPageComponent)} />
      <Route path="/reports/outbound" element={protectedPage(OutboundReportPage as RoutedPageComponent)} />
      <Route path="/reports/inventory" element={protectedPage(InventoryReportPage as RoutedPageComponent)} />
      <Route path="/reports/productivity" element={protectedPage(ProductivityReportPage as RoutedPageComponent)} />
      <Route path="/master-data/skus" element={protectedPage(SKUListPage)} />
      <Route path="/master-data/skus/create" element={protectedPage(SKUFormPage)} />
      <Route
        path="/master-data/skus/:skuId"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <SkuFormRoute onLogout={logout} />
          </ProtectedRoute>
        }
      />
      <Route path="/master-data/customers" element={protectedPage(CustomerManagementPage)} />
      <Route path="/master-data/products" element={protectedPage(ProductMasterDataPage)} />
      <Route path="/master-data/zones" element={protectedPage(ZoneManagementPage as RoutedPageComponent)} />
      <Route path="/master-data/locations" element={protectedPage(LocationManagementPage as RoutedPageComponent)} />
      <Route path="/master-data/containers" element={protectedPage(ContainerManagementPage as RoutedPageComponent)} />
      <Route path="/master-data/seeding-walls" element={protectedPage(SeedingWallManagementPage as RoutedPageComponent)} />
      <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter basename="/projects/Vita-WMS">
      <AppRoutes />
    </BrowserRouter>
  );
}
