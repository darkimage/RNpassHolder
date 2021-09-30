import * as React from "react"
import { storiesOf } from "@storybook/react-native"
import { StoryScreen, Story, UseCase } from "../../../storybook/views"
import { color } from "../../theme"
import { KitModalLoading } from "./kit-modal-loading"

storiesOf("KitModalLoading", module)
  .addDecorator((fn) => <StoryScreen>{fn()}</StoryScreen>)
  .add("Style Presets", () => (
    <Story>
      <UseCase text="Primary" usage="The primary.">
        <KitModalLoading style={{ backgroundColor: color.error }} />
      </UseCase>
    </Story>
  ))
