import { createContext, useContext } from "react";

export const HtmlContainerContext = createContext<any>({ containerRef: null });
export const useHtmlContainerContext = () => useContext(HtmlContainerContext);