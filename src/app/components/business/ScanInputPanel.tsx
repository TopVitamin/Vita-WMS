import type { KeyboardEvent, RefObject } from "react";
import { Scan } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface ScanInputPanelProps {
  label: string;
  value: string;
  placeholder?: string;
  disabled?: boolean;
  inputRef?: RefObject<HTMLInputElement>;
  onChange: (value: string) => void;
  onEnter: (event: KeyboardEvent<HTMLInputElement>) => void;
}

export function ScanInputPanel({
  label,
  value,
  placeholder,
  disabled,
  inputRef,
  onChange,
  onEnter,
}: ScanInputPanelProps) {
  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-2">
        <Scan className="h-4 w-4 text-primary" />
        {label}
      </Label>
      <Input
        ref={inputRef}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={onEnter}
      />
    </div>
  );
}
