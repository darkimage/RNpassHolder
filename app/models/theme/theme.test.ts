import { ThemeModel } from "./theme"

test("can be created", () => {
  const instance = ThemeModel.create({})

  expect(instance).toBeTruthy()
})
