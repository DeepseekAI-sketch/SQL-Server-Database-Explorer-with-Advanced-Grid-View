import React from "react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { AlertCircle, XCircle, CheckCircle } from "lucide-react";

type ErrorSeverity = "error" | "warning" | "success";

interface ErrorDisplayProps {
  message?: string;
  severity?: ErrorSeverity;
  visible?: boolean;
}

const ErrorDisplay = ({
  message = "No error message provided",
  severity = "error",
  visible = true,
}: ErrorDisplayProps) => {
  if (!visible) return null;

  const severityConfig = {
    error: {
      icon: XCircle,
      variant: "destructive" as const,
      title: "Error",
    },
    warning: {
      icon: AlertCircle,
      variant: "default" as const,
      title: "Warning",
    },
    success: {
      icon: CheckCircle,
      variant: "default" as const,
      title: "Success",
    },
  };

  const config = severityConfig[severity];
  const Icon = config.icon;

  return (
    <div className="w-full bg-background p-4">
      <Alert variant={config.variant}>
        <Icon className="h-4 w-4" />
        <AlertTitle>{config.title}</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </Alert>
    </div>
  );
};

export default ErrorDisplay;
