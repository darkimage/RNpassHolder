import React, { FC, useCallback, useEffect, useRef, useState } from "react"
import { observer } from "mobx-react-lite"
import { BackHandler, View } from "react-native"
import { KitBackAction, KitDialog, KitDialogRef, KitHeader, KitModalLoading, KitSelectSource, QrScanner, QRScannerRef, Screen } from "../../components"
import { Icon, Layout, StyleService, TopNavigationAction, useStyleSheet, useTheme } from "@ui-kitten/components"
import { launchImageLibrary } from 'react-native-image-picker';
import { useStores } from "../../models"
import { translate } from "../../i18n"
import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack"
import { NavigatorParamList } from "../../navigators"
import QRSearchGalleryIcon from '../../../assets/svg/qr-search-icon.svg'
import QRScanIcon from '../../../assets/svg/qr-scan-icon.svg'
import { SvgProps } from "react-native-svg"
import { addPassfromSource } from "../../services/database"
import { BarCodeReadEvent } from "react-native-camera"
import { useFocusEffect } from "@react-navigation/core"

export const AddPassScreen: FC<StackScreenProps<NavigatorParamList, "addPass">> = observer(function AddPassScreen({navigation}) {
  const {statusBarStore, currentPassStore} = useStores()
  const styles = useStyleSheet(stylesScreen)
  const [showLoading, setShowLoading] = useState(false)
  // const [showScanner, setShowScanner] = useState(false)
  const qrScanner = useRef<QRScannerRef>()
  const theme = useTheme()
  const dialog = useRef<KitDialogRef>()

  useFocusEffect(() => {
    statusBarStore.setBgColor(((styles.ROOT) as any).backgroundColor)
  })

  const iconProps: SvgProps = {
    style: styles.ICON,
    fill: theme['color-primary-500'],
    fillOpacity: 0.8
  }

  const onSearchGalleryPressed = async () => {
    console.log("AddPassScreen: Opening Gallery")
    launchImageLibrary({ mediaType: 'photo', selectionLimit: 1,}, async (resp) => {
      if (resp.assets) {
        setShowLoading(true)
        const pass = await addPassfromSource({ fromUri: resp.assets[0].uri }, dialog)
        setShowLoading(false)
        if (pass) {
          currentPassStore.setPass(pass._id.toHexString())
          navigation.navigate('viewPass')
        }
      }
    })
  }

  const onQRCodeRead = async (e: BarCodeReadEvent) => {
    qrScanner.current.dismiss()
    setShowLoading(true)
    const pass = await addPassfromSource({ fromString: e.data }, dialog)
    setShowLoading(false)
    if (pass) {
      currentPassStore.setPass(pass._id.toHexString())
      navigation.navigate('viewPass')
    }
  }

  return (
    <View style={styles.ROOT}>
      <KitDialog ref={dialog} />
      <KitModalLoading show={showLoading} />
      <QrScanner
        ref={qrScanner}
        onCancel={() => qrScanner.current.dismiss()}
        onRead={onQRCodeRead}
      />
      <KitHeader
        title={translate('addPass.addTitle')}
        accessoryLeft={<KitBackAction onPress={()=> navigation.goBack()} />}
        setStatusBar={false}
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
            onPress={() => qrScanner.current.show()}
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