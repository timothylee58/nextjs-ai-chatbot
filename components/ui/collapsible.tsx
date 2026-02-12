"use client"

/**
 * @module Collapsible
 * @description Collapsible/expandable content section built on Radix UI.
 * Re-exports Root, Trigger, and Content primitives.
 */
import { Collapsible as CollapsiblePrimitive } from "radix-ui"

const Collapsible = CollapsiblePrimitive.Root

const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger

const CollapsibleContent = CollapsiblePrimitive.CollapsibleContent

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
