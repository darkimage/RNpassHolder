import React, { FC, useEffect, useRef, useState } from "react"
import { observer } from "mobx-react-lite"
import { Image, Platform, View, ViewStyle } from "react-native"
import { KitDialog, KitDialogRef, KitHeader, KitModalLoading, KitSelectSource, QrScanner, Screen, Text } from "../../components"
import { Button, Icon, Layout, StyleService, TopNavigation, TopNavigationAction, useStyleSheet, useTheme } from "@ui-kitten/components"
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { decodeFromImage, decodeFromString } from "../../services/qr"
import { useStores } from "../../models"
import { translate } from "../../i18n"
import { NavigationProp, useNavigation } from "@react-navigation/core"
import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack"
import { NavigatorParamList } from "../../navigators"
import QRSearchGalleryIcon from '../../../assets/svg/qr-search-icon.svg'
import QRScanIcon from '../../../assets/svg/qr-scan-icon.svg'
import { SvgProps } from "react-native-svg"
import { delay } from "../../utils/delay"
import { addPass } from "../../services/database"
import { BarCodeReadEvent } from "react-native-camera"

const BackIcon = (props) => (
  <Icon {...props} name='arrow-back'/>
);

const RenderBackAction = (props: { nav: StackNavigationProp<NavigatorParamList,"addPass"> } ) => (
  <TopNavigationAction onPress={() => props.nav.goBack()} icon={BackIcon}/>
);

export const AddPassScreen: FC<StackScreenProps<NavigatorParamList, "addPass">> = observer(function AddPassScreen({navigation}) {
  const {statusBarStore} = useStores()
  const styles = useStyleSheet(stylesScreen)
  const [showLoading, setShowLoading] = useState(false)
  const [showScanner, setShowScanner] = useState(false)
  const theme = useTheme()
  const dialog = useRef<KitDialogRef>()

  useEffect(() => {
    statusBarStore.setBgColor(((styles.ROOT) as any).backgroundColor)
  }, [])

  const iconProps: SvgProps = {
    style: styles.ICON,
    fill: theme['color-primary-500'],
    fillOpacity: 0.8
  }

  const addPassFromSource = async (data: { fromUri?: string, fromString?: string }) => {
    if (!data || data == null || data === undefined)
      return
    setShowLoading(true)
    let pass = null
    try {
      if(data.fromUri)
        pass = await decodeFromImage(data.fromUri)
      else
        pass = await decodeFromString(data.fromString)
      await delay(1000)
    } catch (error) {
      // TODO: DISPLAY ERROR DIALOG
      console.error(error)
      dialog.current.show({
        title: translate('common.error'),
        description: translate('addPass.genericError'),
        status: 'danger',
        onOk: () => dialog.current.dismiss()
      })
    }
    console.log(JSON.stringify(pass, null, 2))
    if (pass) {
      pass = await addPass(pass)
    } else {
      dialog.current.show({
        title: translate('common.error'),
        description: translate('addPass.emptyScan'),
        status: 'danger',
        onOk: () => dialog.current.dismiss()
      })
    }
    console.log(pass)
    setShowLoading(false)
    console.log("NAVIGATE TO SHOW PASS IF SUCCESSFULL")
  }

  const onSearchGalleryPressed = async () => {
    console.log("Opening Gallery")
    launchImageLibrary({ mediaType: 'photo', selectionLimit: 1,}, async (resp) => {
      if (resp.assets) {
        await addPassFromSource({fromUri: resp.assets[0].uri})
      }
    })
  }

  const onQRCodeRead = async (e: BarCodeReadEvent) => {
    setShowScanner(false)
    await addPassFromSource({ fromString: e.data })
  }

  return (
    <View style={styles.ROOT}>
      <KitDialog ref={dialog} />
      <KitModalLoading show={showLoading} />
      <QrScanner
        show={showScanner}
        onCancel={() => setShowScanner(false)}
        onRead={onQRCodeRead}
      />
      <KitHeader
        title={translate('addPass.addTitle')}
        accessoryLeft={<RenderBackAction nav={navigation} />}
        style={styles.NAV}
        alignment='center' />
      <Screen style={styles.SCREEN} preset="scroll">
        <Layout style={styles.LAYOUT}>
          <KitSelectSource
            title={translate('addPass.searchGallery')}
            icon={<QRSearchGalleryIcon  {...iconProps} />}
            onPress={onSearchGalleryPressed}
          />
          <KitSelectSource
            title={translate('addPass.scanQr')}
            icon={<QRScanIcon  {...iconProps} />}
            onPress={() => setShowScanner(true)}
          />
        </Layout>
      </Screen>
    </View>
  )
})


const stylesScreen = StyleService.create({
  ROOT: {
    flex: 1,
    backgroundColor: 'background-basic-color-4'
  },
  ICON: {
    flex: 1,
    minWidth: '50%',
    alignSelf: 'stretch'
  },
  SCREEN: {
    backgroundColor: 'background-basic-color-2',
    flex:1,
    borderRadius: 20,
    display: 'flex',
    paddingTop: 64,
    overflow: 'hidden',
  },
  IMAGE: {
    width: 200,
    height: 200
  },
  NAV: {
    minHeight: 64,
    backgroundColor: 'background-basic-color-2',
    borderRadius: 20,
    // elevation: 12
  },
  LAYOUT: {
    flex: 1,
    backgroundColor: 'transparent',
    marginHorizontal: 32,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16
  }
})