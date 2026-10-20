import { createContext, type RefObject } from "react";

export const ScrollContainerContext = createContext<RefObject<HTMLDivElement> | null>(null);
