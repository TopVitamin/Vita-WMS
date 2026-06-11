import type { KeyboardEvent, RefObject } from "react";
import { Scan } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";

interface ScanInputPanelProps {
  label: string;
  value: string;
  placeholder?: string;
  disabled?: boolean;
  inputRef?: RefObject<HTMLInputElement>;
  onChange: (value: string) => void;
  onAction?: () => void;
  onEnter: (event: KeyboardEvent<HTMLInputElement>) => void;
  actionLabel?: string;
  helper?: string;
  type?: string;
}

export function ScanInputPanel({
  label,
  value,
  placeholder,
  disabled,
  actionLabel,
  helper,
  inputRef,
  onAction,
  onChange,
  onEnter,
  type,
}: ScanInputPanelProps) {
  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-2">
        <Scan className="h-4 w-4 text-primary" />
        {label}
      </Label>
      <Input
        ref={inputRef}
        type={type}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={onEnter}
      />
      {helper ? <div className="text-xs text-muted-foreground">{helper}</div> : null}
      {actionLabel && onAction ? (
        <Button className="w-full" onClick={onAction} disabled={disabled}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
