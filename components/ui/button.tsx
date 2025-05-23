"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/**
 * Defines visual variants and sizes for the Button component.
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-button text-primary-foreground shadow-sm hover:shadow-primary-glow hover:scale-[1.01] active:scale-[0.99]",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 hover:shadow-sm hover:scale-[1.01] active:scale-[0.99]",
        outline:
          "border border-input bg-background/50 backdrop-blur-sm text-foreground shadow-sm hover:bg-accent/5 hover:text-accent hover:border-accent/30 hover:shadow-sm hover:scale-[1.01] active:scale-[0.99]",
        secondary:
          "bg-secondary/80 text-secondary-foreground shadow-sm hover:bg-secondary hover:shadow-sm hover:scale-[1.01] active:scale-[0.99]",
        ghost: "hover:bg-accent/5 hover:text-accent hover:scale-[1.01] active:scale-[0.99]",
        link: "text-primary underline-offset-4 hover:underline",
        metallic:
          "bg-primary/90 text-primary-foreground shadow-sm hover:shadow-primary-glow hover:scale-[1.01] active:scale-[0.99] btn-hover-slide",
        accent:
          "bg-gradient-accent text-accent-foreground shadow-sm hover:shadow-accent-glow hover:scale-[1.01] active:scale-[0.99]",
        gradient:
          "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-sm hover:shadow-primary-glow hover:from-purple-600 hover:to-blue-600 hover:scale-[1.01] active:scale-[0.99]",
        subtle: "bg-primary/10 text-primary hover:bg-primary/20 hover:scale-[1.01] active:scale-[0.99]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3 text-xs",
        lg: "h-11 px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

/**
 * Props for the Button component.
 */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /**
   * When true, the button will be rendered as a child component (Slot)
   * allowing you to compose it with other components.
   */
  asChild?: boolean
}

/**
 * A stylable, accessible button component.
 *
 * Accepts `variant` and `size` props for visual control, and an optional
 * `asChild` prop for composition with other components.
 *
 * @example
 * ```tsx
 * // Default button
 * <Button>Click me</Button>
 * 
 * // Styled variant
 * <Button variant="accent" size="lg">Large Accent Button</Button>
 * 
 * // As child (composition)
 * <Button asChild>
 *   <Link href="/dashboard">Go to Dashboard</Link>
 * </Button>
 * ```
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
