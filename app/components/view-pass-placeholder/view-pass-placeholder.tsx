import * as React from "react"
import { Dimensions, StyleProp, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { flatten } from "ramda"
import SkeletonPlaceholder from "react-native-skeleton-placeholder"
import { useTheme } from "@ui-kitten/components"

export interface ViewPassPlaceholderProps {
  /**
   * An optional style override useful for padding & margin.
   */
  show: boolean
}

/**
 * Describe your component here
 */
export const ViewPassPlaceholder = observer(function ViewPassPlaceholder(props: ViewPassPlaceholderProps) {
  const { show } = props
  const theme = useTheme()
  const size = Dimensions.get('screen').width - 32

  return (
    show &&
    <SkeletonPlaceholder
      backgroundColor={theme['background-basic-color-3']}
      highlightColor={theme['background-basic-color-1']}
    >
      <SkeletonPlaceholder.Item marginTop={64}>
        <SkeletonPlaceholder.Item
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          <SkeletonPlaceholder.Item width={size} height={size} borderRadius={15} />
          <SkeletonPlaceholder.Item
            width={size}
            height={64}
            marginTop={64}
            borderRadius={4}
          />
          <SkeletonPlaceholder.Item
            width={size}
            height={64}
            marginTop={16}
            borderRadius={4}
          />
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder.Item>
    </SkeletonPlaceholder>
  )
})
