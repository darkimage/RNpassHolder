import React, { FC, useCallback, useEffect } from "react"
import { observer } from "mobx-react-lite"
import { BackHandler, View } from "react-native"
import { Screen, } from "../../components"
import { StyleService, useStyleSheet, Text } from "@ui-kitten/components"
import { useStores } from "../../models"
import { getRealmDatabase } from "../../services/database"
import { ObjectId } from 'bson'
import { useFocusEffect } from "@react-navigation/core"
import { NavigatorParamList } from "../../navigators"
import { StackScreenProps } from "@react-navigation/stack"

export const ViewPassScreen: FC<StackScreenProps<NavigatorParamList, "viewPass">> = observer(function ViewPassScreen({navigation}) {
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()
  const styles = useStyleSheet(styleScreen)
  const {currentPassStore} = useStores()

  const onBackPress = () => {
    navigation.navigate('home')
    return true
  }

  useEffect(() => {
    const getPass = async () => {
      const realm = await getRealmDatabase()
      const pass = realm.objectForPrimaryKey("Pass", new ObjectId(currentPassStore.id))
      console.log("ViewPassScreen: PASS GET:", JSON.stringify(pass, null, 2))
    }
    getPass()
  }, [currentPassStore.id])

  useFocusEffect(
    useCallback(() => {
      BackHandler.addEventListener('hardwareBackPress', onBackPress)
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress)
    }, [])
  )

  // Pull in navigation via hook
  // const navigation = useNavigation()
  return (
    <View style={styles.ROOT}>
      <Screen style={styles.SCREEN} preset="fixed">
        <Text>{JSON.stringify(currentPassStore, null, 2)}</Text>
      </Screen>
    </View>
  )
})

const styleScreen = StyleService.create({
  ROOT: {
    flex: 1,
    backgroundColor: 'background-basic-color-4'
  },
  SCREEN: {
    backgroundColor: 'background-basic-color-2',
    flex:1,
    borderRadius: 20,
    display: 'flex',
    paddingTop: 64,
    overflow: 'hidden',
  },
})
