import { Instance, SnapshotOut, types } from "mobx-state-tree"

/**
 * Model description here for TypeScript hints.
 */
export const ThemeModel = types
  .model("Theme")
  .props({
    current: types.union(types.literal("light"), types.literal("dark"))
  })
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({
    setTheme: (theme: "light" | "dark") => { self.current = theme}
  })) // eslint-disable-line @typescript-eslint/no-unused-vars

type ThemeType = Instance<typeof ThemeModel>
export interface Theme extends ThemeType {}
type ThemeSnapshotType = SnapshotOut<typeof ThemeModel>
export interface ThemeSnapshot extends ThemeSnapshotType {}
export const createThemeDefaultModel = () => types.optional(ThemeModel, {})
