import { CurrentPassModel } from "./current-pass"

test("can be created", () => {
  const instance = CurrentPassModel.create({})

  expect(instance).toBeTruthy()
})
