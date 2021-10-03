/* eslint-disable react-native/split-platform-components */
import * as React from "react"
import { BackHandler, PermissionsAndroid, StyleProp, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import QRCodeScanner, { RNQRCodeScannerProps } from "react-native-qrcode-scanner"
import { Modal, StyleService, Text, useStyleSheet, Button, Card, Layout, Divider } from "@ui-kitten/components"
import { translate } from "../../i18n"
import SVGScannerIcon from '../../../assets/svg/qr-scanner-icon.svg'
import { useFocusEffect } from "@react-navigation/native"
import { useCallback, useEffect, useImperativeHandle, useState } from "react"

async function hasCameraAndroidPermission() {
  const permission = PermissionsAndroid.PERMISSIONS.CAMERA;

  const hasPermission = await PermissionsAndroid.check(permission);
  if (hasPermission) {
    return true;
  }

  const status = await PermissionsAndroid.request(permission);
  return status === 'granted';
}


export interface QrScannerProps extends RNQRCodeScannerProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>,
  /**
   * User as exited the modal view
   */
  onCancel: () => void
}

export interface QRScannerRef {
  show: () => void,
  dismiss: () => void
}

/**
 * A Modal QR Scanner interface
 */
export const QrScanner = observer(function QrScanner(props: QrScannerProps, ref: React.ForwardedRef<any>) {
  const { style, onCancel } = props
  const styles = useStyleSheet(styleComp)
  const [show, setShow] = useState(false)

  useImperativeHandle(ref, () => ({
    show: async () => {
      setShow(await hasCameraAndroidPermission())
    },
    dismiss: () => { setShow(false) }
  }) as QRScannerRef)

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (show) {
          console.log("QRScanner: back pressed show is true hiding")
          setShow(false)
          return true
        } else {
          console.log("QRScanner: back pressed show is false not handling")
          return false
        }
      }

      BackHandler.addEventListener('hardwareBackPress', onBackPress)
      console.log("QRScanner: Added backhandler")

      return () => {
        console.log("QRScanner: Removed Backhandler")
        BackHandler.removeEventListener('hardwareBackPress', onBackPress)
      }
    }, [show, props])
  )


  return (
    <Modal
      backdropStyle={styles.BACKDROP}
      visible={show}
    >
      <Card
        style={[styles.CARD, style]}
        header={() => <View style={styles.CENTER}>
          <Text category="h4" style={styles.TITLE}>{translate('qrCodeScanner.title')}</Text>
        </View>}
        footer={<View style={styles.CENTER}>
          <Button onPress={onCancel} appearance="ghost">
            {translate('common.cancel')}
          </Button>
        </View>}
      >
        <View style={styles.QRSCANNER}>
          <QRCodeScanner
            showMarker={true}
            customMarker={<SVGScannerIcon fill={"#fff"} fillOpacity={0.7} width={200} height={200}  />}
            onRead={(e) => props.onRead(e)}
            containerStyle={styles.CAMERACONTAINER}
            cameraStyle={styles.CAMERA}
          />
        </View>
      </Card>
    </Modal>
  )
}, {forwardRef: true})


const styleComp = StyleService.create({
  CARD: {
    flex: 1,
    margin: 2,
    borderRadius: 20,
    // maxWidth: '90%',
    // elevation: 12
  },
  CENTER: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  QRSCANNER: {
    overflow: 'hidden',
    borderRadius: 20,
    // maxWidth: 250,
    // minHeight: 250,
    flex: 1,
    position: 'relative',
    alignItems: "center",
    marginVertical: 16,
    // marginHorizontal: 32
  },
  TITLE: {
    padding: 16,
  },
  CAMERACONTAINER: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ROOT: {
    backgroundColor: 'background-basic-color-1',
    borderRadius: 20,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    flex: 1,
    paddingVertical: 32,
    // width: 300
  },
  BACKDROP: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  CAMERA: {
    overflow: 'hidden',
    width: 300,
    height: 300,
    borderRadius: 20
  }
})