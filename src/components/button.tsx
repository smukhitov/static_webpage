import { Button as ButtonPrimitive } from "@base-ui/react/button"

import { cn } from "@/utils"

// Classical's own call to action: gilt rule and gilt text on the bare
// parchment, set in the heading face. Padding sets the size rather than a
// fixed height, so the label decides how tall it is.
const CLASSICAL =
  "inline-flex h-auto shrink-0 items-center justify-center rounded-md border border-primary bg-clip-padding px-4 py-2 font-heading text-sm leading-[1.2] font-semibold whitespace-nowrap text-primary transition-all outline-none select-none hover:bg-gilt/12 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:bg-gilt/22 disabled:pointer-events-none disabled:opacity-50"

function Button({ className, ...props }: ButtonPrimitive.Props) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(CLASSICAL, className)}
      {...props}
    />
  )
}

export { Button }
