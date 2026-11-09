import * as React from "react";
import { Check, ChevronDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export interface BrutalComboboxOption {
  value: string;
  label: string;
}

interface BrutalComboboxProps {
  value: string;
  onValueChange: (v: string) => void;
  options: BrutalComboboxOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  ariaLabel?: string;
  triggerClassName?: string;
  inline?: boolean;
}

/**
 * Brutalist searchable combobox: type-to-filter dropdown matching the
 * Toeddro vibe (rounded-2xl, thick border, font-bold uppercase, brutal-shadow).
 */
export const BrutalCombobox = ({
  value,
  onValueChange,
  options,
  placeholder,
  searchPlaceholder = "Type to search…",
  emptyText = "No matches.",
  ariaLabel,
  triggerClassName,
  inline = false,
}: BrutalComboboxProps) => {
  const [open, setOpen] = React.useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          role="combobox"
          aria-expanded={open}
          aria-label={ariaLabel}
          className={cn(
            "flex items-center justify-between gap-2 w-full text-left",
            inline
              ? "h-auto border-0 bg-transparent px-0 py-3 font-medium text-base"
              : "h-auto rounded-2xl border-2 border-foreground bg-muted px-4 py-3 font-bold text-sm min-h-11",
            triggerClassName,
          )}
        >
          <span className={cn("truncate", !selected && "text-muted-foreground")}>
            {selected ? selected.label : placeholder}
          </span>
          <ChevronDown className="w-4 h-4 shrink-0 opacity-60" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        sideOffset={6}
        className="p-0 w-[--radix-popover-trigger-width] min-w-[260px] rounded-2xl border-2 border-foreground bg-card brutal-shadow overflow-hidden"
      >
        <Command shouldFilter className="bg-card [&_[cmdk-input-wrapper]]:bg-muted [&_[cmdk-input-wrapper]]:border-b-2 [&_[cmdk-input-wrapper]]:border-foreground">
          <CommandInput
            placeholder={searchPlaceholder}
            className="h-12 font-medium text-base"
          />
          <CommandList className="max-h-[50vh]">
            <CommandEmpty className="py-4 text-center text-sm font-bold">
              {emptyText}
            </CommandEmpty>
            <CommandGroup className="p-1">
              {options.map((o) => {
                const isActive = o.value === value;
                return (
                  <CommandItem
                    key={o.value}
                    value={`${o.label} ${o.value}`}
                    onSelect={() => {
                      onValueChange(o.value);
                      setOpen(false);
                    }}
                    className={cn(
                      "rounded-xl font-bold text-sm cursor-pointer min-h-11 px-3 my-0.5",
                      "aria-selected:bg-accent aria-selected:text-accent-foreground",
                      isActive && "bg-secondary text-secondary-foreground",
                    )}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4 shrink-0",
                        isActive ? "opacity-100" : "opacity-0",
                      )}
                    />
                    <span className="truncate">{o.label}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};