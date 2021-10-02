import * as React from "react"
import { StyleProp, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { Layout, StyleService, Text, useStyleSheet } from "@ui-kitten/components"

export interface KitDetailFieldProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
  label: string,
  fields: Array<string>,
}

/**
 * Describe your component here
 */
export const KitDetailField = observer(function KitDetailField(props: KitDetailFieldProps) {
  const { style } = props
  const styles = useStyleSheet(stylesComp)

  return (
    <Layout style={[styles.ROOT, style]}>
      <Text
        appearance="hint"
        category="label"
      >
        {props.label}
      </Text>
      <Layout style={[styles.FIELDS, style]}>
        {props.fields.map((item, index) =>(
          <Text
            key={index}
            category='s1'
            style={styles.ITEM}
          >
            {item}
          </Text>
        ))}
      </Layout>
    </Layout>
  )
})

const stylesComp = StyleService.create({
  ROOT: {
    flexDirection: 'column',
    paddingVertical: 8
  },
  FIELDS: {
    flexDirection: 'row',
    // justifyContent: 'space-around'
  },
  ITEM: {
    marginRight: 'auto'
  }
})