import React, { FC, useCallback, useEffect, useRef } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle, StyleSheet, View, Animated, BackHandler } from "react-native"
import { KitTitle, Screen } from "../../components"
import { StyleService, useStyleSheet, Text, Button } from "@ui-kitten/components"
import { useStores } from "../../models"
import { useFocusEffect, useTheme as useNavTheme } from "@react-navigation/native"
import { translate } from "../../i18n/"
import { StackScreenProps } from "@react-navigation/stack"
import { NavigatorParamList } from "../../navigators"


export const IntroScreen: FC<StackScreenProps<NavigatorParamList, "intro">> = observer(function IntroScreen({navigation}) {
  const styles = useStyleSheet(styleScreen)
  const { statusBarStore } = useStores()
  const navTheme = useNavTheme()
  const fadeIn = useRef(new Animated.Value(0)).current
  const springScale = useRef(new Animated.Value(0)).current

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        BackHandler.exitApp()
        return true
      }

      BackHandler.addEventListener('hardwareBackPress', onBackPress)
      console.log("KitDialog: Added backhandler")

      return () => {
        console.log("KitDialog: Removed Backhandler")
        BackHandler.removeEventListener('hardwareBackPress', onBackPress)
      }
    }, [])
  )

  useEffect(() => {
    statusBarStore.setBgColor(navTheme.colors.background)
    fadeIn.setValue(0)
    springScale.setValue(0)
    Animated.timing(fadeIn, {
      toValue: 1,
      duration: 1000,
      delay: 4000,
      useNativeDriver: true
    }).start()

    Animated.spring(springScale, {
      toValue: 1,
      delay: 5000,
      useNativeDriver: true
    }).start()
  }, [])

  // Pull in navigation via hook
  // const navigation = useNavigation()
  return (
    <Screen style={styles.ROOT} preset="fixed">
      <Animated.View style={[styles.CONTAINER, {opacity: fadeIn}]}>
        <Text category="h2">{translate('intro.title')}</Text>
        <KitTitle style={styles.TITLE}/>
      </Animated.View>
      <Animated.View style={{transform: [{scale: springScale}]}}>
        <Button appearance="outline" onPress={() => navigation.navigate('choose')}>{translate('intro.start')}</Button>
      </Animated.View>
    </Screen>
  )
})

const styleScreen = StyleService.create({
  ROOT: {
    ...(StyleSheet.absoluteFillObject),
    alignItems: 'center',
    justifyContent: 'center'
  },
  CONTAINER: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 32,
  },
  TITLE: {
    flex: 0,
    marginLeft: 8
  }
})
