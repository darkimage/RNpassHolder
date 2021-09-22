import React from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle } from "react-native"
import { KitField, Screen } from "../../components"
import { StyleService, useStyleSheet, Text, Toggle } from "@ui-kitten/components"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../../models"

const Test = () => {
  return (
    <Toggle />
  )
}

export const OptionsScreen = observer(function OptionsScreen() {
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()
  const styles = useStyleSheet(stylesScreen)

  // Pull in navigation via hook
  // const navigation = useNavigation()
  return (
    <Screen style={styles.ROOT} preset="fixed">
      <KitField label="Prova" accessoryRight={<Test />} />
    </Screen>
  )
})



const stylesScreen = StyleService.create({
  ROOT: {
    flex: 1,
    marginTop: 16,
    // width: 400
    width: '100%',
    heigth: '100%'
  },
})