import { AlertTriangle, XCircle, WifiOff, ServerCrash } from "lucide-react";
import { Button } from "../ui/button";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

interface ErrorStateProps {
  type?: "general" | "network" | "server" | "notfound";
  title?: string;
  message?: string;
  onRetry?: () => void;
  showAlert?: boolean;
}

export function ErrorState({ 
  type = "general", 
  title,
  message,
  onRetry,
  showAlert = false
}: ErrorStateProps) {
  const errorConfig = {
    general: {
      icon: AlertTriangle,
      defaultTitle: "操作失败",
      defaultMessage: "抱歉，操作未能完成，请稍后重试",
      color: "text-error",
    },
    network: {
      icon: WifiOff,
      defaultTitle: "网络连接失败",
      defaultMessage: "请检查您的网络连接后重试",
      color: "text-warning",
    },
    server: {
      icon: ServerCrash,
      defaultTitle: "服务器错误",
      defaultMessage: "服务器暂时无法响应，请稍后重试",
      color: "text-error",
    },
    notfound: {
      icon: XCircle,
      defaultTitle: "未找到数据",
      defaultMessage: "您查找的内容不存在或已被删除",
      color: "text-muted-foreground",
    },
  };

  const config = errorConfig[type];
  const Icon = config.icon;
  const displayTitle = title || config.defaultTitle;
  const displayMessage = message || config.defaultMessage;

  if (showAlert) {
    return (
      <Alert variant="destructive">
        <Icon className="h-4 w-4" />
        <AlertTitle>{displayTitle}</AlertTitle>
        <AlertDescription className="flex items-center justify-between">
          <span>{displayMessage}</span>
          {onRetry && (
            <Button variant="outline" size="sm" onClick={onRetry} className="ml-4">
              重试
            </Button>
          )}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className={`w-20 h-20 rounded-full bg-error/10 flex items-center justify-center mb-6`}>
        <Icon className={`w-10 h-10 ${config.color}`} />
      </div>
      <h3 className="mb-2">{displayTitle}</h3>
      <p className="text-muted-foreground text-center max-w-md mb-6">
        {displayMessage}
      </p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          重试
        </Button>
      )}
    </div>
  );
}
