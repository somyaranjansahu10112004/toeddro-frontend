import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export interface BrutalSelectOption {
  value: string;
  label: string;
}

interface BrutalSelectProps {
  value: string;
  onValueChange: (v: string) => void;
  options: BrutalSelectOption[];
  placeholder?: string;
  ariaLabel?: string;
  triggerClassName?: string;
  /** Use a compact trigger that lives inside another bordered field */
  inline?: boolean;
}

/**
 * Brutalist-styled select dropdown that matches the Toeddro vibe
 * (rounded-2xl, thick border, font-bold uppercase, brutal-shadow popover).
 * Replaces native <select> so the panel inherits site styling instead of
 * the default browser/OS dropdown chrome.
 */
export const BrutalSelect = ({
  value,
  onValueChange,
  options,
  placeholder,
  ariaLabel,
  triggerClassName,
  inline = false,
}: BrutalSelectProps) => {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger
        aria-label={ariaLabel}
        className={cn(
          inline
            ? "h-auto border-0 bg-transparent px-0 py-3 font-medium text-base focus:ring-0 focus:ring-offset-0 shadow-none"
            : "h-auto rounded-2xl border-2 border-foreground bg-muted px-4 py-3 font-bold text-sm focus:ring-0 focus:ring-offset-0",
          triggerClassName,
        )}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent
        className="rounded-2xl border-2 border-foreground bg-card brutal-shadow p-1 max-h-[60vh]"
        position="popper"
      >
        {options.map((o) => (
          <SelectItem
            key={o.value}
            value={o.value}
            className="rounded-xl font-bold text-sm cursor-pointer focus:bg-accent focus:text-accent-foreground data-[state=checked]:bg-secondary data-[state=checked]:text-secondary-foreground"
          >
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};