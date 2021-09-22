import * as React from "react"
import { StyleProp, TextStyle, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { flatten } from "ramda"
import { Layout, StyleService, useStyleSheet, Text } from "@ui-kitten/components"

export interface KitFieldProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
  accessoryLeft?: React.ReactElement,
  accessoryRight?: React.ReactElement,
  label: React.ReactElement | string
}

/**
 * Describe your component here
 */
export const KitField = observer(function KitField(props: KitFieldProps) {

  const styles = useStyleSheet(styleComp)

  return (
    <Layout style={styles.ROOT} {...props.style}>
      {props.accessoryLeft && <View style={styles.LEFT}>{props.accessoryLeft}</View>}
      <View>
        {typeof props.label === 'string' && <Text>{props.label}</Text>}
        {typeof props.label !== 'string' && props.label}
      </View>
      {props.accessoryRight && <View style={styles.RIGHT}>{props.accessoryRight}</View>}
    </Layout>
  )
})

const styleComp = StyleService.create({
  ROOT: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'transparent',
    minHeight: 64
  },
  LEFT: {
    marginRight: 'auto'
  },
  RIGHT: {
    marginLeft: 'auto'
  }
})