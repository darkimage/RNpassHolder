import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { KitLock, Screen, Text } from "../../components"
import { NavigatorParamList } from "../../navigators"
import { StackScreenProps } from "@react-navigation/stack"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../../models"


export const ChooseScreen: FC<StackScreenProps<NavigatorParamList, "choose">> = observer(function ChooseScreen({navigation}) {
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()

  // Pull in navigation via hook
  // const navigation = useNavigation()
  return (
    <Screen preset="fixed">
      <KitLock
        status="choose"
        onUnlock={() => navigation.navigate('home')}
      />
    </Screen>
  )
})
