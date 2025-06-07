import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function HighlightedTerm({
  term,
  definition,
}: {
  term: string;
  definition: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="text-indigo-400 underline underline-offset-4 hover:text-indigo-300 cursor-pointer">
        {term}
      </PopoverTrigger>
      <PopoverContent className="bg-[#1A1A1A] text-sm text-white border border-[#2A2A2C]">
        <p className="text-indigo-400 font-semibold">{term}</p>
        <p className="text-gray-300 mt-1">{definition}</p>
      </PopoverContent>
    </Popover>
  );
}
