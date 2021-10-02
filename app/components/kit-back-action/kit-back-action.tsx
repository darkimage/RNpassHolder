import * as React from "react"
import { StyleProp, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { Text } from "../"
import { flatten } from "ramda"
import { Icon, TopNavigationAction } from "@ui-kitten/components"

export interface KitBackActionProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
  onPress?: () => void
}

const BackIcon = (props) => (
  <Icon {...props} name='arrow-back'/>
);


/**
 * Describe your component here
 */
export const KitBackAction = observer(function KitBackAction(props: KitBackActionProps) {
  return (
    <TopNavigationAction {...props} icon={BackIcon}/>
  )
})
