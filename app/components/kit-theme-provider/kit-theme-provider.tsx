import * as React from "react"
import { StyleProp, View, ViewStyle, StyleSheet } from "react-native"
import { observer } from "mobx-react-lite"
import { useStores } from "../../models"
import * as eva from '@eva-design/eva'
import { ApplicationProvider, Layout } from "@ui-kitten/components"
import mapping from './mappings.json'

export interface KitThemeProviderProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
  children: React.ReactNode
}



/**
 * Describe your component here
 */
export const KitThemeProvider = observer(function KitThemeProvider(props: KitThemeProviderProps) {
  const { themeStore } = useStores()

  return (
    <ApplicationProvider
      {...eva}
      theme={themeStore.current === "dark" ? eva.dark : eva.light}
      customMapping={mapping}
      {...props}
    />
  )
})
