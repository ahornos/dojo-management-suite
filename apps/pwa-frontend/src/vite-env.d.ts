/**
 * @file vite-env.d.ts
 * @description Vite client types and a React 19 global `JSX` namespace for existing return annotations.
 */

/// <reference types="vite/client" />

import type { JSX as ReactJSX } from 'react';

declare global {
  namespace JSX {
    type Element = ReactJSX.Element;
    interface IntrinsicElements extends ReactJSX.IntrinsicElements {}
    interface ElementClass extends ReactJSX.ElementClass {}
    interface ElementAttributesProperty extends ReactJSX.ElementAttributesProperty {}
    interface ElementChildrenAttribute extends ReactJSX.ElementChildrenAttribute {}
  }
}

export {};
