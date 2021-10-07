/**
 * The app navigator (formerly "AppNavigator" and "MainNavigator") is used for the primary
 * navigation flows of your app.
 * Generally speaking, it will contain an auth flow (registration, login, forgot password)
 * and a "main" flow which the user will use once logged in.
 */
import React, { useEffect, useRef, useState } from "react"
import { AppState, useColorScheme, View, ViewStyle } from "react-native"
import { NavigationContainer, DefaultTheme, DarkTheme, Theme, useTheme as useNavTheme, useNavigationState } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { WelcomeScreen, DemoScreen, DemoListScreen, HomeScreen, AddPassScreen, QrScanDevScreen, ViewPassScreen, ChooseScreen, LockScreen } from "../screens"
import { navigate, navigationRef } from "./navigation-utilities"
import { testKeychain, testREALM } from "../library-tests"
import { useStores } from "../models"
import { keyChainName, KitLock, KitStatusbar } from "../components"
import { useTheme } from "@ui-kitten/components"
import AnimatedSplash from 'react-native-animated-splash-screen'
import { delay } from "../utils/delay"
import LottieView from "lottie-react-native";
import { hasUserSetPinCode } from "@haskkor/react-native-pincode"
import { IntroScreen } from "../screens/intro/intro-screen"
import { observer } from "mobx-react-lite"
import { has } from "mobx"

/**
 * This type allows TypeScript to know what routes are defined in this navigator
 * as well as what properties (if any) they might take when navigating to them.
 *
 * If no params are allowed, pass through `undefined`. Generally speaking, we
 * recommend using your MobX-State-Tree store(s) to keep application state
 * rather than passing state through navigation params.
 *
 * For more information, see this documentation:
 *   https://reactnavigation.org/docs/params/
 *   https://reactnavigation.org/docs/typescript#type-checking-the-navigator
 */
export type NavigatorParamList = {
  home: undefined
  welcome: undefined
  demo: undefined
  demoList: undefined,
  addPass: undefined,
  qrTest: undefined,
  viewPass: undefined,
  intro: undefined,
  choose: undefined,
  lock: undefined
}

// Documentation: https://reactnavigation.org/docs/stack-navigator/
const Stack = createNativeStackNavigator<NavigatorParamList>()

const AppStack = observer(() => {
  const { colors } = useNavTheme()
  const { lockedStore } = useStores()
  const navState = useNavigationState(state => state)
  const [lastRoute, setLastRoute] = useState<string>("home")
  const [hasPin, setHasPin] = useState()
  const appState = useRef(AppState.currentState)
  // const {} = useNavigationState()

  const rootViewStyle: ViewStyle = {
    flex: 1,
    backgroundColor: colors.background
  }

  useEffect(() => {
    // console.log("AppStack: navigationRef.getRootState:", navigationRef.getState())
  }, [navigationRef])

  useEffect(() => {
    console.log("AppStack: lockedStore:", lockedStore.locked)
    console.log("AppStack: navigationRef history:", navState)
    if (lockedStore.locked) {
      const currentRouteName = navState?.routes[navState.index].name
      if(currentRouteName !== "lock")
        setLastRoute(navState?.routes[navState.index].name)
    }
    if (!lockedStore.locked && lastRoute) {
      navigate(lastRoute)
    }
  }, [lockedStore.locked])

  useEffect(() => {
    const hasPinLoad = async () => {
      setHasPin(await hasUserSetPinCode(keyChainName))
    }
    hasPinLoad()
  }, [])

  useEffect(() => {
    const onAppStateChange = nextAppState => {
      console.log("AppStack: onAppStateChange:", navState?.routes?.[navState.index]?.name)
      console.log("AppStack: onAppStateChange:", navState?.routes)
      console.log("AppStack: onAppStateChange:", navState?.routes?.[navState.index]?.name !== "addPass")
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active" &&
        navState?.routes?.[navState.index]?.name !== "addPass"
      ) {
        console.log("KitLock: AppState: App has come to the foreground!");
        lockedStore.setLocked(true)
      } else {
        console.log("KitLock: AppState: App has come to the background!");
      }

      appState.current = nextAppState;
      console.log("KitLock: AppState:", appState.current);
    }
    AppState.addEventListener("change", onAppStateChange );

    return () => {
      console.log("KitLock: AppState: removing handler");
      AppState.removeEventListener("change", onAppStateChange)
    };
  }, [navState]);

  return (
    <View style={rootViewStyle}>
      <Stack.Navigator
        screenOptions={{headerShown: false}}
        initialRouteName="home"
      >
        {!lockedStore.locked ?
          <>
            <Stack.Screen name="home" component={HomeScreen} />
            <Stack.Screen name="addPass" component={AddPassScreen} />
            <Stack.Screen name="viewPass" component={ViewPassScreen} />
            <Stack.Screen name="qrTest" component={QrScanDevScreen} />
            <Stack.Screen name="choose" component={ChooseScreen} />
          </>
          :
          <>
            <Stack.Screen name="lock" component={LockScreen} />
          </>
        }
        {!hasPin &&
          <Stack.Screen name="intro" component={IntroScreen} />
        }
        {/* <Stack.Screen name="welcome" component={WelcomeScreen} /> */}
        {/* <Stack.Screen name="demoList" component={DemoListScreen} /> */}
        {/* <Stack.Screen name="demo" component={DemoScreen} /> */}
      </Stack.Navigator>
    </View>
  )
})


interface NavigationProps extends Partial<React.ComponentProps<typeof NavigationContainer>> {}

export const AppNavigator = observer((props: NavigationProps) => {
  const theme = useTheme()
  const navTheme = useNavTheme()
  const { lockedStore, themeStore, favoritePassStore, currentPassStore, optionShowFavoriteStore } = useStores()
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (favoritePassStore.id !== '' && optionShowFavoriteStore.show) {
      currentPassStore.setPass(favoritePassStore.id)
      navigate('viewPass')
    }

    const setIntro = async () => {
      if (!(await hasUserSetPinCode(keyChainName))) {
        console.log("AppNavigator: user has not set any pin showing INTRO")
        lockedStore.setLocked(false)
        navigate("intro")
      }
    }
    setIntro()

    const load = async () => {
      setLoaded(false)
      await delay(3500)
      setLoaded(true)
    }
    load()

  }, [])

  const KitThemeLight: Theme = {
    dark: false,
    colors: {
      primary: theme['color-primary-500'],
      background: theme['background-basic-color-4'],
      card: theme['background-basic-color-1'],
      text: theme['text-basic-color'],
      border: theme['color-basic-default-border'],
      notification: theme['color-danger-500'],
    },
  };

  const KitThemedark: Theme = {
    dark: true,
    colors: {...KitThemeLight.colors}
  }

  return (
    <AnimatedSplash
      isLoaded={loaded}
      logoHeight={250}
      logoWidth={250}
      customComponent={<LottieView imageAssetsFolder={'lottie/logo'} source={require("../../assets/animations/logo-intro.json")} autoPlay loop={false} />}
    >
      <NavigationContainer
        ref={navigationRef}
        theme={themeStore.current === 'dark' ? KitThemedark : KitThemeLight}
        {...props}
      >
        <AppStack />
      </NavigationContainer>
    </AnimatedSplash>
  )
})

AppNavigator.displayName = "AppNavigator"

/**
 * A list of routes from which we're allowed to leave the app when
 * the user presses the back button on Android.
 *
 * Anything not on this list will be a standard `back` action in
 * react-navigation.
 *
 * `canExit` is used in ./app/app.tsx in the `useBackButtonHandler` hook.
 */
const exitRoutes = ["home", "intro"]
export const canExit = (routeName: string) => exitRoutes.includes(routeName)
