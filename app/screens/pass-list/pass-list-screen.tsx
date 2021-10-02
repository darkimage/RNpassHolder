import React from "react"
import { observer } from "mobx-react-lite"
import { View, ViewStyle } from "react-native"
import { Screen } from "../../components"
import { Button, Icon, Layout, StyleService, Text, useStyleSheet } from '@ui-kitten/components'
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../../models"
import { color } from "../../theme"
import { translate } from "../../i18n"
import Realm, { Collection, CollectionChangeSet, Results } from "realm";
import { useGetPassListQuery, useRealmResultsHook } from "../../services/database"
import { useNavigation } from "@react-navigation/native"
import { navigate } from "../../navigators"

export const PassListScreen = observer(function PassListScreen() {
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()
  const styles = useStyleSheet(stylesScreen)
  const query = useGetPassListQuery()
  const tasklist = useRealmResultsHook(query)

  // Pull in navigation via hook

  return (
    <Screen style={styles.ROOT} preset="scroll">
      <Button onPress={() => navigate("qrTest")}>Go to DEV Screen</Button>
      <Button onPress={()=> navigate("viewPass")}>Go to View Screen</Button>
      {tasklist?.map((task) => <Text key={task.added}>{JSON.stringify(task, null, 2)}</Text>)}
    </Screen>
  )
})

const stylesScreen = StyleService.create({
  ROOT: {
    paddingTop: 64,
    width: '100%',
  },
})