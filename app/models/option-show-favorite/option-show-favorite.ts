import { Instance, SnapshotOut, types } from "mobx-state-tree"

/**
 * Model description here for TypeScript hints.
 */
export const OptionShowFavoriteModel = types
  .model("OptionShowFavorite")
  .props({
    show: types.optional(types.boolean, true)
  })
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({
    setAlwaysShowFavorite: (show: boolean) => {self.show = show}
  })) // eslint-disable-line @typescript-eslint/no-unused-vars

type OptionShowFavoriteType = Instance<typeof OptionShowFavoriteModel>
export interface OptionShowFavorite extends OptionShowFavoriteType {}
type OptionShowFavoriteSnapshotType = SnapshotOut<typeof OptionShowFavoriteModel>
export interface OptionShowFavoriteSnapshot extends OptionShowFavoriteSnapshotType {}
export const createOptionShowFavoriteDefaultModel = () => types.optional(OptionShowFavoriteModel, {})
