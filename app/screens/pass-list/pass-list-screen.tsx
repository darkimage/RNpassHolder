import React, { FC, useCallback } from "react"
import { observer } from "mobx-react-lite"
import { FlatList, FlatListProps, View, ViewStyle } from "react-native"
import { PassListEmpty, Screen } from "../../components"
import { Button, Icon, Layout, StyleService, Text, useStyleSheet } from '@ui-kitten/components'
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../../models"
import { color } from "../../theme"
import { translate } from "../../i18n"
import Realm, { Collection, CollectionChangeSet, Results } from "realm";
import { QRPass, useGetPassListQuery, useRealmResultsHook } from "../../services/database"
import { useNavigation } from "@react-navigation/native"
import { navigate, NavigatorParamList } from "../../navigators"
import { KitItemPass } from "../../components/kit-item-pass/kit-item-pass"
import { StackScreenProps } from "@react-navigation/stack"
import { useStores } from "../../models"
import { PassListPlaceholder } from "../../components/pass-list-placeholder/pass-list-placeholder"

type EmptyItem = {empty: boolean}

export const PassListScreen: FC<StackScreenProps<NavigatorParamList, "home">> = observer(function PassListScreen({navigation}) {
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()
  const styles = useStyleSheet(stylesScreen)
  const query = useGetPassListQuery()
  const { currentPassStore } = useStores()
  const tasklist = useRealmResultsHook(query)
  const numColumns = 2

  const testData: any[] = [
    { _id: 1 },
    { _id: 2 },
    { _id: 3 },
    { _id: 3 },
    { _id: 3 },
    { _id: 3 },
    { _id: 3 },
    { _id: 3 },
    { _id: 3 },
    { _id: 3 },
    { _id: 3 },
  ]
  // Pull in navigation via hook

  console.log("PassListScreen: tasklist:", tasklist == null)

  const renderItem = (props: { item: QRPass, index: number, separators }) => {
    console.log("PassListScreen: renderItem:", props.index)
    return (
      <KitItemPass
        key={props.index}
        passData={props.item}
        onPress={onPassPress}
      />
    )
  }

  const onPassPress = useCallback((pass: QRPass) => {
    currentPassStore.setPass(pass?._id.toHexString())
    navigation.navigate('viewPass')
  }, [navigation])

  const onEmptyAddPress = useCallback(() => {
    navigation.navigate('addPass')
  }, [navigation])

  const formatData = (data: Array<QRPass | EmptyItem>, numColumns) => {
    let numberOfElementsLastRow = data.length % numColumns;
    console.log("PassListScreen: formatData:", numberOfElementsLastRow)
    while (numberOfElementsLastRow !== numColumns && numberOfElementsLastRow !== 0) {
      data.push({empty: true})
      numberOfElementsLastRow++;
    }
    console.log("PassListScreen: formatData: data:", data)
    return data
  }

  const keyExtractor = (item: QRPass | EmptyItem, index: number): string => {
    return index.toString()
  }

  const dataIsEmpty = tasklist?.length === 0
  const dataLoading = tasklist == null
  const hasData = !dataLoading && !dataIsEmpty

  return (
    <Screen style={[styles.ROOT, dataIsEmpty && styles.EMPTY]} preset="fixed">
      {hasData &&
        <FlatList
          numColumns={numColumns}
          contentContainerStyle={styles.LIST}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          data={formatData(tasklist, numColumns)}
          columnWrapperStyle={styles.COLUMN}
        />
      }
      { dataLoading && <PassListPlaceholder />}
      {dataIsEmpty && <PassListEmpty onPress={onEmptyAddPress}/>}
    </Screen>
  )
})

// {/* {tasklist?.map((task) => <Text key={task.added}>{JSON.stringify(task, null, 2)}</Text>)} */}
const stylesScreen = StyleService.create({
  ROOT: {
    width: '100%',
    // paddingBottom: 64,
  },
  EMPTY: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  LIST: {
    // flex: 1,
    paddingTop: 64 + 16,
    paddingBottom: 32,
    paddingHorizontal: 16,
    // alignItems: 'flex-start',
    // height: '100%'
  },
  COLUMN: {
    marginVertical: 8,
  }
})