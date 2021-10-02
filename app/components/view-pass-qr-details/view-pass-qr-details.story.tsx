import * as React from "react"
import { storiesOf } from "@storybook/react-native"
import { StoryScreen, Story, UseCase } from "../../../storybook/views"
import { color } from "../../theme"
import { ViewPassQrDetails } from "./view-pass-qr-details"

storiesOf("ViewPassQrDetails", module)
  .addDecorator((fn) => <StoryScreen>{fn()}</StoryScreen>)
  .add("Style Presets", () => (
    <Story>
      <UseCase text="Primary" usage="The primary.">
        <ViewPassQrDetails style={{ backgroundColor: color.error }} />
      </UseCase>
    </Story>
  ))
