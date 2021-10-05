import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { KitHeader, KitHomeBottomNav, KitThemeSwitch, KitTitle, Screen } from "../../components"
// import { useNavigation } from "@react-navigation/native"
import { useStores } from "../../models"
import { Button, Icon, StyleService, useStyleSheet } from "@ui-kitten/components"
import { OptionsScreen, PassListScreen } from ".."
import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack"
import { NavigatorParamList } from "../../navigators"
import { View } from "react-native"

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
    onPress={() => props.navigation.navigate('addPass')}
    accessoryRight={AddIcon} />
}

export const HomeScreen: FC<StackScreenProps<NavigatorParamList, "home">> = observer(function HomeScreen({navigation}) {
  const styles = useStyleSheet(styleScreen)

  return (<View style={styles.VIEWROOT}>
    <KitHeader
      setStatusBar={true}
      title={<KitTitle />}
      accessoryLeft={<KitThemeSwitch />}
      accessoryRight={<AddPass navigation={navigation} />}
    />
    <Screen style={styles.ROOT} preset="fixed">
      <KitHomeBottomNav>
        <KitHomeBottomNav.Screen component={<PassListScreen navigation={navigation} route={undefined} />} tabID={0} />
        <KitHomeBottomNav.Screen component={<OptionsScreen />} tabID={1} />
      </KitHomeBottomNav>
    </Screen>
  </View>)
})

const styleScreen = StyleService.create({
  VIEWROOT: {
    backgroundColor: 'background-basic-color-4',
    flex:1
  },
  ROOT: {
    paddingHorizontal: 0,
    paddingTop: 64
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