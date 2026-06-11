import type { ComponentProps } from "react";
import { TableCell, TableHead } from "../ui/table";
import { cn } from "../ui/utils";

type StickyActionTableHeadProps = ComponentProps<typeof TableHead>;
type StickyActionTableCellProps = ComponentProps<typeof TableCell>;

export function StickyActionTableHead({ className, ...props }: StickyActionTableHeadProps) {
  return (
    <TableHead
      className={cn("sticky right-0 z-20 bg-[var(--table-header-bg)] text-right shadow-[-8px_0_12px_-12px_rgba(15,23,42,0.45)]", className)}
      {...props}
    />
  );
}

export function StickyActionTableCell({ className, ...props }: StickyActionTableCellProps) {
  return (
    <TableCell
      className={cn("sticky right-0 z-10 bg-background text-right shadow-[-8px_0_12px_-12px_rgba(15,23,42,0.35)]", className)}
      {...props}
    />
  );
}
