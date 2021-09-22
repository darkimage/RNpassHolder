import { OptionShowFavoriteModel } from './../option-show-favorite/option-show-favorite';
import { LockedModel } from './../locked/locked';
import { StatusbarModel } from './../statusbar/statusbar';
import { ThemeModel } from './../theme/theme';
import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { CharacterStoreModel } from "../character-store/character-store"

/**
 * A RootStore model.
 */
// prettier-ignore
export const RootStoreModel = types.model("RootStore").props({
  characterStore: types.optional(CharacterStoreModel, {} as any),
  themeStore: types.optional(ThemeModel, { current: 'light' } as any),
  statusBarStore: types.optional(StatusbarModel, { backgroundColor: '#A6C1FF' } as any),
  lockedStore: types.optional(LockedModel, { locked: true } as any),
  optionShowFavoriteStore: types.optional(OptionShowFavoriteModel, {show: true} as any)
})

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}

/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}
