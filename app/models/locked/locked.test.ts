import { LockedModel } from "./locked"

test("can be created", () => {
  const instance = LockedModel.create({})

  expect(instance).toBeTruthy()
})
