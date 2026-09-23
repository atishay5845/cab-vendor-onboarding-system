import type { ReactNode } from "react";
import { AppShell } from "./AppShell";
/** Wraps authenticated pages in the shared fleet operations shell. */
export function PageRoute({children}:{children:ReactNode}){return <AppShell>{children}</AppShell>}
