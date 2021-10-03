import { Instance, SnapshotOut, types } from "mobx-state-tree"

/**
 * Model description here for TypeScript hints.
 */
export const FavoritePassModel = types
  .model("FavoritePass")
  .props({
    id:types.string
  })
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({
    setFavorite: (id: string) => {self.id = id}
  })) // eslint-disable-line @typescript-eslint/no-unused-vars

type FavoritePassType = Instance<typeof FavoritePassModel>
export interface FavoritePass extends FavoritePassType {}
type FavoritePassSnapshotType = SnapshotOut<typeof FavoritePassModel>
export interface FavoritePassSnapshot extends FavoritePassSnapshotType {}
export const createFavoritePassDefaultModel = () => types.optional(FavoritePassModel, {})
