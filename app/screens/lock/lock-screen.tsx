import React from "react"
import { observer } from "mobx-react-lite"
import { KitLock, Screen } from "../../components"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../../models"

export const LockScreen = observer(function LockScreen() {
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()

  // Pull in navigation via hook
  // const navigation = useNavigation()
  return (
    <Screen preset="fixed">
      <KitLock status='enter' />
    </Screen>
  )
})