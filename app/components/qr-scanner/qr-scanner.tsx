import * as React from "react"
import { StyleProp, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import QRCodeScanner, { RNQRCodeScannerProps } from "react-native-qrcode-scanner"
import { Modal, StyleService, Text, useStyleSheet, Button, Card } from "@ui-kitten/components"
import { translate } from "../../i18n"

export interface QrScannerProps extends RNQRCodeScannerProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>,
  show: boolean,
  onCancel: () => void
}

/**
 * Describe your component here
 */
export const QrScanner = observer(function QrScanner(props: QrScannerProps) {
  const { style, show, onCancel } = props
  const styles = useStyleSheet(styleComp)

  return (
    <Modal
      backdropStyle={styles.BACKDROP}
      visible={show}>
      <View style={[styles.ROOT, style]}>
        <View style={styles.QRSCANNER}>
          <QRCodeScanner
            onRead={(e) => props.onRead(e)}
            containerStyle={styles.CAMERACONTAINER}
            cameraStyle={styles.CAMERA}
            topContent={<Text category="h3">{translate('qrCodeScanner.title')}</Text> }
          />
        </View>
        <Button onPress={onCancel} style={styles.CANCEL}>{translate('common.cancel')}</Button>
      </View>
    </Modal>
  )
})


const styleComp = StyleService.create({
  QRSCANNER: {
    overflow: 'hidden',
    borderRadius: 20,
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
    flex: 1,
    padding: 32,
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