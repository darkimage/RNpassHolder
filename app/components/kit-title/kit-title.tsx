import * as React from "react"
import { StyleProp, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { Layout, StyleService, Text, useStyleSheet } from "@ui-kitten/components"

export interface KitTitleProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
}

/**
 * Describe your component here
 */
export const KitTitle = observer(function KitTitle(props: KitTitleProps) {
  const style = useStyleSheet(styles);

  return (
    <Layout style={style.LAYOUT}>
      <Text style={style.TEXTLEFT} category='h3'>safe</Text>
      <Text style={style.TEXTRIGHT} category='h3'>Pass</Text>
    </Layout>
  )
})

const styles = StyleService.create({
  LAYOUT: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'transparent'
  },
  TEXTLEFT: {
    color: 'color-primary-default'
  },
  TEXTRIGHT: {
    marginLeft: 2
  }
})