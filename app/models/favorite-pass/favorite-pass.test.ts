import { FavoritePassModel } from "./favorite-pass"

test("can be created", () => {
  const instance = FavoritePassModel.create({})

  expect(instance).toBeTruthy()
})
