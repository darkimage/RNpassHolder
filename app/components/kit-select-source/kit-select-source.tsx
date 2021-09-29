import * as React from "react"
import { StyleProp, TouchableNativeFeedback, View, ViewProps, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { StyleService, useStyleSheet, Text, Layout, TextProps, useTheme } from "@ui-kitten/components"
import { TouchableHighlight, TouchableOpacity } from "react-native-gesture-handler"

export interface KitSelectSourceProps extends ViewProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>,
  title?: string
  titleProps?: TextProps,
  icon?: React.ReactElement
}

/**
 * Describe your component here
 */
export const KitSelectSource = observer(function KitSelectSource(props: KitSelectSourceProps) {
  const { style } = props
  const styles = useStyleSheet(styleComp)
  const theme = useTheme()

  return (
    <View style={styles.ROOT}>
      <View style={styles.TOUCH}>
      <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple(theme['color-basic-transparent-focus'], false)}>
        <Layout style={styles.LAYOUT}>
          <Text
            category="h4"
            {...props.titleProps}
            style={[styles.TEXT, props.titleProps?.style]}
          >
            {props.title}
            </Text>
            <View style={styles.ICONCONTAINER}>
            {props?.icon}
            </View>
        </Layout>
        </TouchableNativeFeedback>
      </View>
    </View>
  )
})

const styleComp = StyleService.create({
  ICONCONTAINER: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  TOUCH: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden'
  },
  ROOT: {
    backgroundColor: 'background-basic-color-1',
    borderRadius: 20,
    elevation: 20,
    // padding: 8,
    margin: 16,
    flex: 1,
    width: '100%',
  },
  TEXT: {
    marginBottom: 'auto'
  },
  LAYOUT: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    padding: 8,
  },
  PLACEHOLDER: {
    backgroundColor: 'color-primary-200',
    borderRadius: 20,
    width: 128,
    height: 128,
    marginBottom: 'auto'
  }
})