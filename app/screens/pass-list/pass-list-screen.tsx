import React from "react"
import { observer } from "mobx-react-lite"
import { View, ViewStyle } from "react-native"
import { Screen } from "../../components"
import { Button, Icon, Layout, StyleService, Text, useStyleSheet } from '@ui-kitten/components'
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../../models"
import { color } from "../../theme"
import { translate } from "../../i18n"

export const PassListScreen = observer(function PassListScreen() {
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()
  const styles = useStyleSheet(stylesScreen)

  // Pull in navigation via hook
  // const navigation = useNavigation()
  return (
    <Screen style={styles.ROOT} preset="fixed">
      <Layout style={styles.TITLE}>
        <Text>PROVA</Text>
      </Layout>
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
  TITLE: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    flexDirection: 'row',
    backgroundColor: 'transparent'
  },
  ADDBTN: {
    marginLeft: 'auto'
  }
})