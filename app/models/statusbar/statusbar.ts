import { Instance, SnapshotOut, types } from "mobx-state-tree"

/**
 * Model description here for TypeScript hints.
 */
export const StatusbarModel = types
  .model("Statusbar")
  .props({
    backgroundColor: types.optional(types.string, '#0000'),
  })
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({
    setBgColor: (color: string) => { self.backgroundColor = color }
  })) // eslint-disable-line @typescript-eslint/no-unused-vars


type StatusbarType = Instance<typeof StatusbarModel>
export interface Statusbar extends StatusbarType {}
type StatusbarSnapshotType = SnapshotOut<typeof StatusbarModel>
export interface StatusbarSnapshot extends StatusbarSnapshotType {}
export const createStatusbarDefaultModel = () => types.optional(StatusbarModel, {})
