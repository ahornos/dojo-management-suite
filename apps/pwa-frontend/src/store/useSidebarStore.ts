/**
 * @file useSidebarStore.ts
 * @description Shared collapsed-rail state for the workspace sidebar and topbar toggle.
 */

import { create } from 'zustand';

/** localStorage key shared with the previous Sidebar-only implementation. */
export const SIDEBAR_RAIL_STORAGE_KEY = 'dms-sidebar-collapsed';

/**
 * @returns {boolean} Whether the icon-only rail was last selected.
 */
function readRailCollapsed(): boolean {
  try {
    return window.localStorage.getItem(SIDEBAR_RAIL_STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

/**
 * @param {boolean} collapsed - Next rail preference.
 * @returns {void}
 */
function persistRailCollapsed(collapsed: boolean): void {
  try {
    window.localStorage.setItem(SIDEBAR_RAIL_STORAGE_KEY, collapsed ? '1' : '0');
  } catch {
    // Preference is best-effort; a full storage quota must not break navigation.
  }
}

interface SidebarState {
  collapsed: boolean;
  toggleCollapsed: () => void;
}

/**
 * Zustand hook for the icon-only sidebar rail. Persists `'1'`/`'0'` so existing
 * user preferences survive the move out of component-local state.
 *
 * @constant useSidebarStore
 */
export const useSidebarStore = create<SidebarState>((set) => ({
  collapsed: readRailCollapsed(),
  toggleCollapsed: () =>
    set((state) => {
      const collapsed = !state.collapsed;
      persistRailCollapsed(collapsed);
      return { collapsed };
    }),
}));
