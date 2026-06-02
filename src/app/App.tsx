import "../styles/globals.css";
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
import InboundDetailPage from "./pages/InboundDetailPage";
import InboundListPage from "./pages/InboundListPage";
import InventoryDetailPage from "./pages/InventoryDetailPage";
import InventoryQueryPage from "./pages/InventoryQueryPage";
import InventoryTransactionPage from "./pages/InventoryTransactionPage";
import LocationManagementPage from "./pages/LocationManagementPage";
import OutboundCheckPage from "./pages/OutboundCheckPage";
import OutboundDetailPage from "./pages/OutboundDetailPage";
import OutboundListPage from "./pages/OutboundListPage";
import PackingTaskListPage from "./pages/PackingTaskListPage";
import PackingWorkspacePage from "./pages/PackingWorkspacePage";
import PickingTaskDetailPage from "./pages/PickingTaskDetailPage";
import PickingTaskListPage from "./pages/PickingTaskListPage";
import PickingWorkspacePage from "./pages/PickingWorkspacePage";
import ProductMasterDataPage from "./pages/ProductMasterDataPage";
import PutawayDetailPage from "./pages/PutawayDetailPage";
import PutawayListPage from "./pages/PutawayListPage";
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
import wmsLoginHero from "../assets/wms-login-hero.png";

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
    <main className="min-h-screen bg-background">
      <div className="grid min-h-screen grid-cols-1 md:grid-cols-[minmax(0,1fr)_420px] xl:grid-cols-[minmax(0,1fr)_480px]">
        <section className="flex min-h-[360px] flex-col justify-between border-b bg-card px-6 py-7 md:min-h-screen md:border-b-0 md:border-r md:px-8 md:py-8 lg:px-12">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded bg-primary text-primary-foreground">
              <Warehouse className="h-6 w-6" />
            </div>
            <div>
              <div className="text-xl font-semibold">Vita-WMS</div>
              <div className="text-sm text-muted-foreground">跨境电商海外仓作业演示系统</div>
            </div>
          </div>

          <div className="max-w-3xl py-8 md:py-10 xl:py-14">
            <div className="mb-4 inline-flex items-center gap-2 rounded border px-3 py-1 text-sm text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Demo Environment
            </div>
            <h1 className="max-w-3xl text-3xl font-semibold leading-tight lg:text-4xl xl:text-5xl">
              从入库、上架、拣货、打包到库存盘点的一体化海外仓 WMS
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
              用于课程演示的前端 Demo，登录后直接进入业务工作台，可查看入库、出库、库存、SKU、波次、拣货、打包和盘点等核心页面。
            </p>

            <div className="mt-7 overflow-hidden rounded-lg border bg-background shadow-sm">
              <img
                src={wmsLoginHero}
                alt="海外仓 WMS 作业场景"
                className="h-56 w-full object-cover md:h-60 xl:h-72"
              />
            </div>
          </div>

          <div className="hidden text-sm text-muted-foreground md:block">
            Warehouse demo for Amazon US, eBay UK, Walmart Canada and Shopify merchants.
          </div>
        </section>

        <section className="flex items-center justify-center px-5 py-6 md:min-h-screen md:px-7">
          <Card className="w-full max-w-md">
            <CardHeader className="pb-4">
              <CardTitle>进入 WMS</CardTitle>
              <CardDescription>演示环境不校验账号，填写任意信息即可进入系统。</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue={initialTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">
                    <Lock className="mr-2 h-4 w-4" />
                    登录
                  </TabsTrigger>
                  <TabsTrigger value="register">
                    <UserPlus className="mr-2 h-4 w-4" />
                    注册
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="login" className="mt-5">
                  <form className="space-y-3" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                      <Label htmlFor="login-account">账号</Label>
                      <Input id="login-account" defaultValue="demo@baoxia-wms.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password">密码</Label>
                      <Input id="login-password" type="password" defaultValue="demo123456" />
                    </div>
                    <Button className="w-full" type="submit">
                      登录并进入工作台
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="register" className="mt-5">
                  <form className="space-y-3" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                      <Label htmlFor="register-name">姓名</Label>
                      <Input id="register-name" placeholder="例如：海外仓运营主管" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-email">邮箱</Label>
                      <Input id="register-email" type="email" placeholder="name@example.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-password">密码</Label>
                      <Input id="register-password" type="password" placeholder="至少 8 位" />
                    </div>
                    <Button className="w-full" type="submit">
                      注册并进入工作台
                      <PackageCheck className="ml-2 h-4 w-4" />
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </section>
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

    if (path === "/inventory/adjustment" || path.startsWith("/reports")) {
      navigate("/");
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
      <Route path="/inbound/arrival-scan" element={protectedPage(ArrivalScanPage as RoutedPageComponent)} />
      <Route path="/inbound/management" element={protectedPage(InboundListPage as RoutedPageComponent)} />
      <Route path="/inbound/detail" element={protectedPage(InboundDetailPage as RoutedPageComponent)} />
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
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
