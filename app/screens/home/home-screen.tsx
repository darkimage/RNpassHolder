import React, { FC, useEffect, useLayoutEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { KitHeader, KitHomeBottomNav, KitThemeSwitch, KitTitle, Screen } from "../../components"
// import { useNavigation } from "@react-navigation/native"
import { useStores } from "../../models"
import { Button, Icon, Layout, StyleService, Text, useStyleSheet } from "@ui-kitten/components"
import { testLibraries } from "../../library-tests"
import { OptionsScreen, PassListScreen } from ".."
import { translate } from "../../i18n"
import { useNavigation } from "@react-navigation/core"
import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack"
import { NavigatorParamList } from "../../navigators"
import Realm, { Collection, CollectionChangeSet, Results } from "realm";
import { TaskSchema, useGetPassListQuery, useRealmResultsHook } from "../../services/database"

const AddIcon = (props) => (
  <Icon {...props} name='plus-outline'/>
);

type AppPaddProps = {navigation: StackNavigationProp<NavigatorParamList, "home">}

const AddPass = (props: AppPaddProps) => {
  const styles = useStyleSheet(styleScreen)
  const [circleSytle, setCircleStytle] = useState({});

  function calCircleStyle(layoutEvent) {
    const {width, height} = layoutEvent.nativeEvent.layout;
    const dim = width > height ? width : height;

    setCircleStytle({width: dim, height:dim, borderRadius:dim/2});
  }

  return <Button
    onLayout={calCircleStyle}
    // appearance='outline'
    style={[circleSytle, styles.ADDBTN]}
    onPress={() => props.navigation.navigate('demo')}
    accessoryRight={AddIcon} />
}

export const HomeScreen:  FC<StackScreenProps<NavigatorParamList, "home">> = observer(function HomeScreen({navigation}) {
  const styles = useStyleSheet(styleScreen)
  const { lockedStore } = useStores()
  const query = useGetPassListQuery()
  const tasklist = useRealmResultsHook(query)

  useEffect(() => {
    lockedStore.setLocked(false)
  }, [])

  const addTasks = async () => {
    const realm = await Realm.open({
      path: "myrealm",
      schema: [TaskSchema],
    });
    realm.write(() => {
      realm.create("Task", {
        _id: Math.round(Math.random() * 100),
        name: "go grocery shopping",
        status: "Open",
      });
      realm.create("Task", {
        _id: Math.round(Math.random() * 100),
        name: "go exercise",
        status: "Open",
      });
      console.log(`created two tasks`);
    });
  }

  return (
    <Screen style={styles.ROOT} preset="fixed">
      <Layout style={styles.ROOT}>
        <KitHeader
          setStatusBar={!lockedStore.locked}
          title={<KitTitle />}
          accessoryLeft={<KitThemeSwitch />}
          accessoryRight={<AddPass navigation={navigation} />}
        />
        <Layout>
          {tasklist?.map((task) => <Text key={task._id}>{JSON.stringify(task, null, 2)}</Text>)}
        </Layout>
        <Button onPress={addTasks} >Add task</Button>
        {/* <KitHomeBottomNav>
          <KitHomeBottomNav.Screen component={<PassListScreen />} tabID={0} />
          <KitHomeBottomNav.Screen component={<OptionsScreen />} tabID={1} />
        </KitHomeBottomNav> */}
      </Layout>
    </Screen>
  )
})

const styleScreen = StyleService.create({
  ROOT: {
    flex: 1,
    backgroundColor: 'background-basic-color-4',
    paddingHorizontal: 0
  },
  LAYOUT: {
    zIndex: -1,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0000000'
  },
  SCREEN: {
    flex: 1,
    backgroundColor: '#0000000'
  },
  ADDBTN: {
    width: 16,
    height: 16
  }
})