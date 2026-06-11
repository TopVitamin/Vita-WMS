import { cn } from "../ui/utils";

interface StatusTabCountProps {
  count: number;
  inverseOnActive?: boolean;
}

export function StatusTabCount({ count, inverseOnActive = false }: StatusTabCountProps) {
  return (
    <span
      className={cn(
        "text-[11px] font-normal leading-none text-muted-foreground/70",
        inverseOnActive
          ? "group-data-[state=active]:text-primary-foreground/75"
          : "group-data-[state=active]:text-primary/70",
      )}
    >
      {count}
    </span>
  );
}
