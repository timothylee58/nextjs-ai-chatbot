/**
 * @file react-renderer.tsx
 * @description Utility class for rendering React components into arbitrary DOM
 * elements within the ProseMirror editor. Provides a static render method that
 * creates a React root on a given DOM element and returns a destroy function for
 * cleanup. Used to embed React-based UI widgets (such as suggestion previews)
 * inside the editor's decoration layer.
 */

import { createRoot } from "react-dom/client";

// biome-ignore lint/complexity/noStaticOnlyClass: "Needs to be static"
export class ReactRenderer {
  static render(component: React.ReactElement, dom: HTMLElement) {
    const root = createRoot(dom);
    root.render(component);

    return {
      destroy: () => root.unmount(),
    };
  }
}
