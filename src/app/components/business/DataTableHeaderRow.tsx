import type { ComponentProps } from "react";
import { TableRow } from "../ui/table";
import { cn } from "../ui/utils";

type DataTableHeaderRowProps = ComponentProps<typeof TableRow>;

export function DataTableHeaderRow({ className, ...props }: DataTableHeaderRowProps) {
  return <TableRow className={cn("bg-[var(--table-header-bg)]", className)} {...props} />;
}
