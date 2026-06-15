import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-12 items-center justify-center border-3 border-black bg-white p-1",
      className
    )}
    style={{ boxShadow: "3px 3px 0px 0px #000000" }}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap px-4 py-2 text-sm font-bold uppercase tracking-wider transition-all",
      "border-2 border-transparent hover:bg-neo-yellow hover:border-black",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2",
      "disabled:pointer-events-none disabled:opacity-50",
      "data-[state=active]:bg-neo-yellow data-[state=active]:border-black data-[state=active]:shadow-neo-sm",
      className
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-4 border-3 border-black bg-white p-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2",
      className
    )}
    style={{ boxShadow: "4px 4px 0px 0px #000000" }}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
