import { cva } from "class-variance-authority"

export const toastVariants = cva(
  "fixed bottom-4 right-4 z-50 flex w-full max-w-sm items-center space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all duration-300",
  {
    variants: {
      variant: {
        default: "border bg-background text-foreground",
        destructive:
          "destructive border-destructive bg-destructive text-destructive-foreground",
        success: "border-green-500 bg-green-50 text-green-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)
