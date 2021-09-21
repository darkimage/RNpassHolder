import { StatusbarModel } from "./statusbar"

test("can be created", () => {
  const instance = StatusbarModel.create({})

  expect(instance).toBeTruthy()
})
