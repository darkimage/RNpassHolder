import * as React from "react"
import { StyleProp, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import QRCodeScanner, { RNQRCodeScannerProps } from "react-native-qrcode-scanner"
import { Modal, StyleService, Text, useStyleSheet, Button, Card, Layout, Divider } from "@ui-kitten/components"
import { translate } from "../../i18n"
import SVGScannerIcon from '../../../assets/svg/qr-scanner-icon.svg'

export interface QrScannerProps extends RNQRCodeScannerProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>,
  /**
   * Modal State
   */
  show: boolean,
  /**
   * User as exited the modal view
   */
  onCancel: () => void
}

/**
 * A Modal QR Scanner interface
 */
export const QrScanner = observer(function QrScanner(props: QrScannerProps) {
  const { style, show, onCancel } = props
  const styles = useStyleSheet(styleComp)

  return (
    <Modal
      backdropStyle={styles.BACKDROP}
      visible={show}>
      <Card
        style={styles.CARD}
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
          <View style={styles.OVERLAY}>
            <SVGScannerIcon fill={"#fff"} fillOpacity={0.7} width={200} height={200}  />
          </View>
          <QRCodeScanner
            onRead={(e) => props.onRead(e)}
            containerStyle={styles.CAMERACONTAINER}
            cameraStyle={styles.CAMERA}
          />
        </View>
      </Card>
    </Modal>
  )
})


const styleComp = StyleService.create({
  CARD: {
    flex: 1,
    margin: 2,
    borderRadius: 20,
    elevation: 12
  },
  CENTER: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  QRSCANNER: {
    overflow: 'hidden',
    borderRadius: 20,
    maxWidth: 250,
    minHeight: 250,
    flex: 1,
    position: 'relative',
    alignItems: "center"
  },
  TITLE: {
    padding: 16,
  },
  OVERLAY: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0, bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 99
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
    width: 300
  },
  BACKDROP: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  CAMERA: {
    overflow: 'hidden',
    width: 250,
    height: 250,
    borderRadius: 20
  }
})