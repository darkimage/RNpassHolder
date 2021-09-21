import * as React from "react"
import { StyleProp, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { Layout, Text, useStyleSheet, StyleService, useTheme, TopNavigation, TopNavigationProps } from "@ui-kitten/components"
import { KitStatusbar } from ".."
import { useStores } from "../../models"

export interface KitHeaderProps extends TopNavigationProps{
  setStatusBar?: boolean
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
}

/**
 * Application Header component
 */
export const KitHeader = observer(function KitHeader(props: KitHeaderProps) {
  const style = useStyleSheet(styles);
  const theme = useTheme()
  const {statusBarStore} = useStores()

  React.useEffect(() => {
    if (props.setStatusBar) {
      console.log(((style.LAYOUT) as any).backgroundColor)
      statusBarStore.setBgColor(((style.LAYOUT) as any).backgroundColor)
    }
    else
      statusBarStore.setBgColor(theme['color-primary-default'])
  }, [props.setStatusBar, theme])

  return (
    <Layout style={style.LAYOUT}>
      <TopNavigation
        alignment='center'
        style={style.NAV}
        {...props} />
    </Layout>
  )
})


const styles = StyleService.create({
  LAYOUT: {
    backgroundColor: 'background-basic-color-1',
    elevation: 23,
    shadowColor: 'border-primary-color-5',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: 'hidden'
  },
  NAV: {
    backgroundColor: 'transparent',
  }
});