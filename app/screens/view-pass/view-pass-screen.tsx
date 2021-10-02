/* eslint-disable react-native/no-inline-styles */
import React, { FC, ReactElement, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { observer } from "mobx-react-lite"
import { Animated, BackHandler, Dimensions, LayoutAnimation, TouchableWithoutFeedback, View } from "react-native"
import { KitBackAction, KitDetailField, KitHeader, Screen, ViewPassActionMenu, ViewPassPlaceholder, } from "../../components"
import { StyleService, useStyleSheet, Text, TopNavigationAction, Layout, Card, Divider, Icon } from "@ui-kitten/components"
import { useStores } from "../../models"
import { getRealmDatabase, QRPass } from "../../services/database"
import { ObjectId } from 'bson'
import { useFocusEffect } from "@react-navigation/core"
import { NavigatorParamList } from "../../navigators"
import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack"
import { translate } from "../../i18n"
import QRCode from "react-native-qrcode-svg"
import SkeletonPlaceholder from "react-native-skeleton-placeholder"
import { delay } from "../../utils/delay"
import { useTheme } from "@react-navigation/native"
import dayjs from 'dayjs'

const EyeIcon = (props: { hide: boolean, onPress: () => void }) => {
  const styles = useStyleSheet(stylesEye)
  const fadeIn = useRef(new Animated.Value(1)).current

  useEffect(() => {
    // fadeIn.setValue(props.hide ? 0 : 1)
    console.log("EyeIcon:", props.hide ? 1 : 0)
    Animated.timing(fadeIn, {
      duration: 500,
      toValue: props.hide ? 1 : 0,
      useNativeDriver: true
    }).start()
  }, [props.hide])

  return (
    <TouchableWithoutFeedback onPress={props.onPress}>
      <View style={styles.ROOT}>
        <Animated.View style={[styles.ICON, { opacity: fadeIn.interpolate({ inputRange: [0, 1], outputRange: [0, 1]}) }]}>
          <Icon fill='#8F9BB3' name="eye" />
        </Animated.View>
        <Animated.View style={[styles.ICON, { opacity: fadeIn.interpolate({ inputRange: [0, 1], outputRange: [1, 0]}) }]}>
          <Icon fill='#8F9BB3' name="eye-off"/>
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  )
};

const stylesEye = StyleService.create({
  ROOT: {
    minHeight: 32,
    minWidth: 32,
    maxHeight: 32,
    maxWidth: 32,
    position: 'relative'
  },
  ICON: {
    position: 'absolute',
    minHeight: 32,
    minWidth: 32,
    top: 0,
    left: 0
  }
})

const springProps = {
  duration: 700,
  create: { type: "linear", property: "opacity" },
  update: { type: "spring", springDamping: 0.7 },
  delete: { type: "linear", property: "opacity" },
}

const QRDetails = (props: { qr: QRPass }) => {
  const { qr } = props
  const styles = useStyleSheet(stylesQRDetails)
  const [open, setOpen] = useState(false)

  const closeStyle = {
    height: 0,
    paddingVertical: 0,
    paddingHorizontal: 0,
  }

  const openStyle = {
    height: 'auto',
    paddingVertical: 16,
    paddingHorizontal: 16,
  }

  return (
    <View style={styles.ROOT}>
      <Layout style={styles.LAYOUT}>
        <Layout style={styles.HEADER}>
          <EyeIcon
            hide={open}
            onPress={() => {
              LayoutAnimation.configureNext(springProps)
              setOpen(!open)
          }}/>
          <Text category='h6' style={styles.TITLE}>{translate('viewPass.details')}</Text>
        </Layout>
        <Divider />
        <Layout style={[styles.CONTENT, open ? openStyle : closeStyle]}>
          <KitDetailField label={translate('viewPass.nameLabel')} fields={[qr.surname, qr.name]} />
          <KitDetailField label={translate('viewPass.typeLabel')} fields={[translate(`pass.${qr.type}`)]} />
          <KitDetailField label={translate('viewPass.lastLabel')} fields={[dayjs(qr.lastVaccination).format('DD/MM/YYYY')]} />
          {qr.expires !== '' && <KitDetailField label={translate('viewPass.expiresLabel')} fields={[dayjs(qr.expires).format('DD/MM/YYYY')]} />}
        </Layout>
      </Layout>
    </View>
  )
}

const stylesQRDetails = StyleService.create({
  ROOT: {
    flex: 1,
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'background-basic-color-1',
    marginTop: 16,
    position: 'absolute',
    bottom: 0,
    elevation: 12
  },
  LAYOUT: {
    // paddingVertical: 16,
    // paddingHorizontal: 32,
    backgroundColor: 'background-basic-color-1',
  },
  TITLE: {
    marginLeft: 16
  },
  HEADER: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center'
  },
  CONTENT: {
    height: 'auto',
    // minHeight: 100,
  }
})

export const ViewPassScreen: FC<StackScreenProps<NavigatorParamList, "viewPass">> = observer(function ViewPassScreen({navigation}) {
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()
  const styles = useStyleSheet(styleScreen)
  const navTheme = useTheme()
  const { currentPassStore, statusBarStore } = useStores()
  const [pass, setPass] = useState<QRPass>()

  const onBackPress = () => {
    console.log("ViewPassScreen: Navigating home")
    navigation.navigate('home')
    return true
  }

  useFocusEffect(() => {
    statusBarStore.setBgColor(navTheme.colors.background)
  })

  useEffect(() => {
    const getPass = async () => {
      const realm = await getRealmDatabase()
      const passData = realm.objectForPrimaryKey("Pass", new ObjectId(currentPassStore.id))
      // await delay(5000)
      setPass(passData as any)
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

  const qrSize = Dimensions.get('screen').width - 16
  // Pull in navigation via hook
  // const navigation = useNavigation()
  return (
    <View style={styles.ROOT}>
      <KitHeader
        title={translate("viewPass.title")}
        accessoryLeft={<KitBackAction onPress={() => navigation.navigate('home')} />}
        accessoryRight={<ViewPassActionMenu />}
        setStatusBar={false}
        style={[styles.NAV, {backgroundColor: navTheme.colors.background}]}
        alignment="center"
      />
      <Screen style={[styles.SCREEN, {backgroundColor: navTheme.colors.background}]} preset="fixed">
        {pass &&
          <Layout style={styles.LAYOUT}>
            <View style={styles.QR}><QRCode size={qrSize} value={pass.qr} /></View>
            <QRDetails qr={pass} />
          </Layout>
        }
        <ViewPassPlaceholder show={!pass} />
      </Screen>
    </View>
  )
})


const styleScreen = StyleService.create({
  ROOT: {
    flex: 1,
  },
  SCREEN: {
    flex:1,
    display: 'flex',
    overflow: 'hidden',
  },
  NAV: {
    minHeight: 64,
  },
  LAYOUT: {
    flex: 1,
    backgroundColor: 'transparent',
    // marginHorizontal: 32,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    // marginBottom: 16,
    marginTop: 64,
  },
  QR: {
    marginTop: 16
  }
})
