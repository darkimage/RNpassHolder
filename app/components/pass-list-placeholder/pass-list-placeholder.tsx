import * as React from "react"
import { StyleProp, TextStyle, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import SkeletonPlaceholder from 'react-native-skeleton-placeholder'
import { useTheme } from "@ui-kitten/components"

export interface PassListPlaceholderProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
}

/**
 * Describe your component here
 */
export const PassListPlaceholder = observer(function PassListPlaceholder(props: PassListPlaceholderProps) {

  const theme = useTheme()
  const size = 128

  return (
    <SkeletonPlaceholder
      backgroundColor={theme['background-basic-color-3']}
      highlightColor={theme['background-basic-color-1']}
    >
      <SkeletonPlaceholder.Item alignItems="center" marginTop={64} flexDirection="column">
        <SkeletonPlaceholder.Item flexDirection="row" marginVertical={16}>
          <SkeletonPlaceholder.Item height={size} width={size} marginRight={16}/>
          <SkeletonPlaceholder.Item height={size} width={size} marginLeft={16}/>
        </SkeletonPlaceholder.Item>
        <SkeletonPlaceholder.Item flexDirection="row"  marginVertical={16}>
          <SkeletonPlaceholder.Item height={size} width={size} marginRight={16}/>
          <SkeletonPlaceholder.Item height={size} width={size} marginLeft={16}/>
        </SkeletonPlaceholder.Item>
        <SkeletonPlaceholder.Item flexDirection="row"  marginVertical={16}>
          <SkeletonPlaceholder.Item height={size} width={size} marginRight={16}/>
          <SkeletonPlaceholder.Item height={size} width={size} marginLeft={16}/>
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder.Item>
    </SkeletonPlaceholder>
  )
})
