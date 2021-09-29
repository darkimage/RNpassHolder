import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { Image, Platform, View, ViewStyle } from "react-native"
import { KitHeader, KitSelectSource, Screen, Text } from "../../components"
import { Button, Icon, Layout, StyleService, TopNavigation, TopNavigationAction, useStyleSheet, useTheme } from "@ui-kitten/components"
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { readFile } from 'react-native-fs'
import { Buffer } from 'buffer'
import { decode } from "jpeg-js"
import jsQR from "jsqr"
import pako from 'pako'
import base45 from 'base45-js/lib/base45-js.js'
import { decodeGreenPassQR } from "../../services/qr"
import { useStores } from "../../models"
import { translate } from "../../i18n"
import { NavigationProp, useNavigation } from "@react-navigation/core"
import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack"
import { NavigatorParamList } from "../../navigators"
import QRSearchGalleryIcon from '../../../assets/svg/qr-search-icon.svg'
import QRScanIcon from '../../../assets/svg/qr-scan-icon.svg'
import { SvgProps } from "react-native-svg"
const CBOR = require('cbor-js') 
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../../models"

const BackIcon = (props) => (
  <Icon {...props} name='arrow-back'/>
);

const RenderBackAction = (props: { nav: StackNavigationProp<NavigatorParamList,"addPass"> } ) => (
  <TopNavigationAction onPress={() => props.nav.goBack()} icon={BackIcon}/>
);

export const AddPassScreen: FC<StackScreenProps<NavigatorParamList, "addPass">> = observer(function AddPassScreen({navigation}) {
  const {statusBarStore} = useStores()
  const [image, setImage] = useState(null);
  const styles = useStyleSheet(stylesScreen)
  const theme = useTheme()

  useEffect(() => {
    statusBarStore.setBgColor(((styles.ROOT) as any).backgroundColor)
  }, [])

  const pickImage = async () => {
    // launchImageLibrary({mediaType: 'photo'}, async (resp) => {
    //   if (resp.assets) {
    //     console.log(resp.assets[0].uri)
    //     setImage(resp.assets[0])
    //     // Get the file as raw base binary data
    //     try {
    //       console.log(JSON.stringify(await decodeGreenPassQR(resp.assets[0].uri), null, 2))
    //     } catch (error) {
    //       console.error(error)
    //     }
    //   }
    // })
    // launchCamera({ mediaType: 'photo' }, async (resp) => {
    //   console.log(resp.assets)
    // })
  }

  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()

  const iconProps: SvgProps = {
    style: styles.ICON,
    fill: theme['color-primary-500'],
    fillOpacity: 0.8
  }
  // Pull in navigation via hook
  // const navigation = useNavigation()
  return (<View style={styles.ROOT}>
    <KitHeader
      title={translate('addPass.addTitle')}
      accessoryLeft={<RenderBackAction nav={navigation} />}
      style={styles.NAV}
      alignment='center' />
    <Screen style={styles.SCREEN} preset="scroll">
      <Layout style={styles.LAYOUT}>
        <KitSelectSource title={translate('addPass.searchGallery')} icon={ <QRSearchGalleryIcon  {...iconProps} />}/>
        <KitSelectSource title={translate('addPass.scanQr')} icon={<QRScanIcon  {...iconProps} /> }/>
      </Layout>
      {/* <Button onPress={pickImage} >Pick an image from camera roll</Button>
      {image != null && <Image source={{ uri: image.uri }} style={styles.IMAGE} />} */}
    </Screen>
  </View>)
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