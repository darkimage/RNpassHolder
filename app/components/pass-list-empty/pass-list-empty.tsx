import * as React from "react"
import { StyleProp, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { StyleService, useStyleSheet, Text, Button } from "@ui-kitten/components"
import { translate } from "../../i18n"

export interface PassListEmptyProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
  onPress?: () => void
}

/**
 * Describe your component here
 */
export const PassListEmpty = observer(function PassListEmpty(props: PassListEmptyProps) {
  const { style, onPress } = props
  const styles = useStyleSheet(styleComp)

  return (
    <View style={[styles.ROOT, style]}>
      <Text
        appearance="hint"
      >
        {translate('emptyList.emptyMessage')}
      </Text>
      <Button
        appearance="ghost"
        onPress={onPress}
      >
        {translate('emptyList.addOne')}
      </Button>
    </View>
  )
})

const styleComp = StyleService.create({
  ROOT: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  }
})