import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"

import { cn } from "@/lib/utils"

const Avatar = React.forwardRef(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn("relative flex h-8 w-8 shrink-0 overflow-hidden ", className)}
    {...props} />
))
Avatar.displayName = AvatarPrimitive.Root.displayName

const AvatarImage = React.forwardRef(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("h-full w-full object-cover bg-transparent", className)}
    {...props} />
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = React.forwardRef(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center  bg-muted",
      className
    )}
    {...props} />
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

export { Avatar, AvatarImage, AvatarFallback }
// import * as AvatarPrimitive from "@radix-ui/react-avatar"

// import { cn } from "@/lib/utils"

// const Avatar = React.forwardRef(({ className, ...props }, ref) => (
//   <AvatarPrimitive.Root
//     ref={ref}
//     className={cn("relative h-full w-full flex shrink-0 overflow-hidden ", className)}
//     {...props} />
// ))
// Avatar.displayName = AvatarPrimitive.Root.displayName

// const AvatarImage = React.forwardRef(({ className, ...props }, ref) => (
//   <AvatarPrimitive.Image
//     ref={ref}
//     className={cn("h-full w-full ", className)}
//     {...props} />
// ))
// AvatarImage.displayName = AvatarPrimitive.Image.displayName

// const AvatarFallback = React.forwardRef(({ className, ...props }, ref) => (
//   <AvatarPrimitive.Fallback
//     ref={ref}
//     className={cn(
//       "flex h-full w-full items-center justify-center  bg-muted",
//       className
//     )}
//     {...props} />
// ))
// AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

// export { Avatar, AvatarImage, AvatarFallback }
