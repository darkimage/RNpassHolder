import * as React from "react"
import { StyleProp, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { Layout, StyleService, Text, useStyleSheet } from "@ui-kitten/components"

export interface KitTitleProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
  /**
   * An optional style override for Text useful for padding & margin, color etc..
   */
  styleText?: StyleProp<ViewStyle>
}

/**
 * Describe your component here
 */
export const KitTitle = observer(function KitTitle(props: KitTitleProps) {
  const {style, styleText } = props
  const styles = useStyleSheet(styleComp)

  return (
    <Layout style={[styles.LAYOUT, style]}>
      <Text style={[styles.TEXTLEFT, styleText]} category='h3'>safe</Text>
      <Text style={[styles.TEXTRIGHT, styleText]} category='h3'>Pass</Text>
    </Layout>
  )
})

const styleComp = StyleService.create({
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