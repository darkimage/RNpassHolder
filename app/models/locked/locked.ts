import { Instance, SnapshotOut, types } from "mobx-state-tree"

/**
 * Model description here for TypeScript hints.
 */
export const LockedModel = types
  .model("Locked")
  .props({
    locked: types.optional(types.boolean, true)
  })
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({
    setLocked: (lock: boolean) => {self.locked = lock}
  })) // eslint-disable-line @typescript-eslint/no-unused-vars

type LockedType = Instance<typeof LockedModel>
export interface Locked extends LockedType {}
type LockedSnapshotType = SnapshotOut<typeof LockedModel>
export interface LockedSnapshot extends LockedSnapshotType {}
export const createLockedDefaultModel = () => types.optional(LockedModel, {})
