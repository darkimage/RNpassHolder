import * as React from "react"
import { StatusBar } from "react-native"
import { observer } from "mobx-react-lite"
import { useStores } from "../../models"

/**
 * Application status bar component
 */
export const KitStatusbar = observer(function KitStatusbar() {
  const { themeStore, statusBarStore } = useStores()

  React.useEffect(() => {
    console.log("theme store:", themeStore.current)
    StatusBar.setBarStyle(themeStore.current === 'light' ? "dark-content" : "light-content", true)
    StatusBar.setBackgroundColor(statusBarStore.backgroundColor)
  }, [themeStore.current, statusBarStore.backgroundColor])

  return (
    <StatusBar />
  )
})
