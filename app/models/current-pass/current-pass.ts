import { QRPass } from './../../services/database/realm';
import { Instance, SnapshotOut, types } from "mobx-state-tree"

/**
 * Model description here for TypeScript hints.
 */
export const CurrentPassModel = types
  .model("CurrentPass")
  .props({
    id: types.string
  })
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({
    setPass: (passID: string) => { self.id = passID}
  })) // eslint-disable-line @typescript-eslint/no-unused-vars

type CurrentPassType = Instance<typeof CurrentPassModel>
export interface CurrentPass extends CurrentPassType {}
type CurrentPassSnapshotType = SnapshotOut<typeof CurrentPassModel>
export interface CurrentPassSnapshot extends CurrentPassSnapshotType {}
export const createCurrentPassDefaultModel = () => types.optional(CurrentPassModel, {})
