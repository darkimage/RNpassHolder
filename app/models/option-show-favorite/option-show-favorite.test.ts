import { OptionShowFavoriteModel } from "./option-show-favorite"

test("can be created", () => {
  const instance = OptionShowFavoriteModel.create({})

  expect(instance).toBeTruthy()
})
