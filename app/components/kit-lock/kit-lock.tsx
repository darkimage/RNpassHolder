import * as React from "react"
import { StyleProp, View, ViewStyle, StyleSheet, BackHandler, AppState } from "react-native"
import { observer } from "mobx-react-lite"
import PINCode, { deleteUserPinCode, hasUserSetPinCode, IProps, resetPinCodeInternalStates } from "@haskkor/react-native-pincode"
import { useEffect, useRef, useState } from "react"
import * as Keychain from 'react-native-keychain';
import { Icon, StyleService, useStyleSheet, useTheme, Text, Button } from "@ui-kitten/components"
import { useTheme as useNavTheme } from "@react-navigation/native"
import { useStores } from "../../models"
import {TouchableOpacity } from "react-native-gesture-handler"
import { translate } from "../../i18n"
import LottieView from 'lottie-react-native'
import { onSnapshot } from "mobx-state-tree"

export interface KitLockProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>,
  status: "choose" | "enter" | "locked";
  onUnlock?: () => void
}

export const keyChainName = "safePassUSERPIN"
export const maxAttemps = 5
export const timelocked = 180000

/**
 * Describe your component here
 */
export const KitLock = observer(function KitLock(props: KitLockProps) {
  const {statusBarStore, lockedStore} = useStores()
  const styles = useStyleSheet(styleComp)
  const navTheme = useNavTheme()
  const theme = useTheme()
  const { onUnlock } = props
  // const appState = useRef(AppState.currentState);

  // const [show, setShow] = useState(lockedStore.locked)

  console.log("KitLock: locked:", lockedStore.locked)
  
  // useEffect(() => {
  //   console.log("KitLock: locked:", lockedStore.locked)
  //   if(props.status === 'enter' || props.status === 'locked')
  //     setShow(lockedStore.locked)
  //   else
  //     setShow(true)
  // }, [lockedStore.locked])

  useEffect(() => {
    // const resetPin = async () => {
    //   await resetPinCodeInternalStates()
    //   await deleteUserPinCode(keyChainName)
    //   console.log("KitLock: resetPinCodeInternalStates: reset")
    // }
    // if (__DEV__)
    //   resetPin()
    statusBarStore.setBgColor(navTheme.colors.background)
  }, [])

  // useEffect(() => {
  //   const onAppStateChange = nextAppState => {
  //     if (
  //       appState.current.match(/inactive|background/) &&
  //       nextAppState === "active"
  //     ) {
  //       console.log("KitLock: AppState: App has come to the foreground!");
  //       lockedStore.setLocked(true)
  //       setShow(true)
  //     } else {
  //       console.log("KitLock: AppState: App has come to the background!");
  //     }

  //     appState.current = nextAppState;
  //     console.log("KitLock: AppState:", appState.current);
  //   }
  //   AppState.addEventListener("change", onAppStateChange );

  //   return () => {
  //     console.log("KitLock: AppState: removing handler");
  //     AppState.removeEventListener("change", onAppStateChange)
  //   };
  // }, []);

  useEffect(() => {
    const onBackPress = () => {
      if (props.status === "enter" || props.status === "locked") {
        console.log("KitLock: back pressed and status is enter, cannot go back")
        BackHandler.exitApp()
        return true
      } else {
        return false
      }
    }

    BackHandler.addEventListener('hardwareBackPress', onBackPress)
    console.log("KitLock: Added backhandler")

    return () => {
      console.log("KitLock: Removed Backhandler")
      BackHandler.removeEventListener('hardwareBackPress', onBackPress)
    }
  }, [props])

  const onFinish = async (pin: string) => {
    const hasPin = await hasUserSetPinCode();
    console.log("KitLock: hasUserSetPinCode:", hasPin)
    onUnlock?.()
    console.log("KitLock: pin:", pin)
    const pinFromKeyChain = await Keychain.getInternetCredentials(keyChainName)
    console.log("KitLock: pinFromKeyChain:", pinFromKeyChain)
    // setShow(false)
    lockedStore.setLocked(false)
  }

  const delIconComponent = (erase: any) => (
    <TouchableOpacity onPress={() => erase()}>
      <View style={styles.DELICONROOT}>
        <Icon
          width={32}
          height={32}
          fill={theme['background-alternative-color-1']}
          name="backspace"
        />
        <Text>{translate('common.delete')}</Text>
      </View>
    </TouchableOpacity>
  )

  const i18n = {
    titleEnter: translate('pinCode.titleEnter'),
    titleValidationFailed: translate('pinCode.titleValidationFailed'),
    touchIDSentence: translate('pinCode.touchIDSentence'),
    touchIDTitle: translate('pinCode.touchIDTitle'),
    subtitleChoose: translate('pinCode.subtitleChoose'),
    subtitleError: translate('pinCode.subtitleError'),
    textButtonLockedPage: translate('pinCode.textButtonLockedPage'),
    textCancelButtonTouchID: translate('pinCode.textCancelButtonTouchID'),
    textDescriptionLockedPage: translate('pinCode.textDescriptionLockedPage', {timeLocked: timelocked/60000}),
    textSubDescriptionLockedPage: translate('pinCode.textSubDescriptionLockedPage'),
    textTitleLockedPage: translate('pinCode.textTitleLockedPage'),
    titleAttemptFailed: translate('pinCode.titleAttemptFailed'),
    titleChoose: translate('pinCode.titleChoose'),
    titleConfirm: translate('pinCode.titleConfirm'),
    titleConfirmFailed: translate('pinCode.titleConfirmFailed'),
  }

  const buttonComponentLockedPage = () => (
    <Button
      appearance="ghost"
      onPress={() => BackHandler.exitApp()}
    >
      {translate('common.exit')}
    </Button>
  )

  const titleComponentLockedPage = () => (
    <Text
      style={styles.LOCKTEXTTITLE}
      category="h5"
    >
      {i18n.textTitleLockedPage}
    </Text>
  )

  const iconComponentLockedPage = () => (
    <View style={styles.LOCKICON}>
      <LottieView source={require("../../../assets/animations/logo-lock-anim.json")} autoPlay />
    </View>
  )

  return (
  <View style={[styles.ROOT, {backgroundColor: navTheme.colors.background}]}>
    <PINCode
      {...props}
      pinCodeKeychainName={keyChainName}
      finishProcess={onFinish}
      numbersButtonOverlayColor={theme['color-info-transparent-500']}
      colorPasswordEmpty={theme['color-info-300']}
      colorPassword={theme['color-info-500']}
      colorCircleButtons={theme['background-basic-color-1']}
      buttonDeleteComponent={delIconComponent}
      buttonComponentLockedPage={buttonComponentLockedPage}
      styleLockScreenMainContainer={[styles.LOCKROOT, {backgroundColor: navTheme.colors.background}]}
      maxAttempts={maxAttemps}
      iconComponentLockedPage={iconComponentLockedPage}
      styleLockScreenViewTimer={styles.VIEWTIMER}
      styleLockScreenText={styles.LOCKTEXT}
      styleLockScreenTextTimer={styles.LOCKTIMERTEXT}
      titleComponentLockedPage={titleComponentLockedPage}
      touchIDDisabled={true}
      timeLocked={timelocked}
      {...i18n}
    />
  </View>
  )
})

const styleComp = StyleService.create({
  ROOT: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 99,
  },
  DELICONROOT: {
    justifyContent: "center",
    alignItems: "center",
  },
  LOCKROOT: {
    position: "absolute",
    top: 0,
    flexBasis: 0,
    left: 0,
    height: "100%",
    width: "100%",
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  VIEWTIMER: {
    paddingLeft: 30,
    paddingRight: 30,
    paddingBottom: 10,
    paddingTop: 10,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "color-info-transparent-600",
    marginBottom: 32,
  },
  LOCKTEXT: {
    color: 'text-hint-color',
    textAlign: "center",
  },
  LOCKTEXTTITLE: {
    marginVertical: 32,
    textAlign: 'center'
  },
  LOCKICON: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 256,
    height: 256
  },
  LOCKTIMERTEXT: {
    color: 'text-hint-color'
  }
})