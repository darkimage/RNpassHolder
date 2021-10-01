/* eslint-disable react-native/sort-styles */
/* eslint-disable react-native/no-color-literals */
import React, { useRef, useState } from "react"
import { observer } from "mobx-react-lite"
import {
  Text,
  TouchableOpacity,
  ViewStyle,
  StyleSheet
} from 'react-native';

import QRCodeScanner from 'react-native-qrcode-scanner';
import { Button } from "@ui-kitten/components";
import { KitDialog, KitDialogRef, KitModalLoading, QrScanner } from "../../components";

// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../../models"

export const QrScanDevScreen = observer(function QrScanDevScreen() {
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()
  const [showScanner, setShowScanner] = useState(false)
  const dialog = useRef<KitDialogRef>(null)

  const onSuccess = (e) => {
    console.log(e)
  }

  // Pull in navigation via hook
  // const navigation = useNavigation()
  return (
    <>
      <Button onPress={() => setShowScanner(true)}>Mostra scanner</Button>
      <Button
        onPress={() =>
          dialog.current.show({
            title: "Prova",
            description: "Prova descrizione",
            okText: "Salva",
            onCancel: () => null,
            onBackdropPress: () => dialog.current.dismiss(),
          })
        }
      >
        Mostra dialogo
      </Button>
      <KitDialog ref={dialog} />
      {/* <KitModalLoading show={true}/> */}
      <QrScanner
        show={showScanner}
        onRead={(e) => {
          setShowScanner(false)
          console.log(e)
        }}
        onCancel={() => setShowScanner(false)}
      />
    </>
  )
})

const styles = StyleSheet.create({
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777'
  },
  textBold: {
    fontWeight: '500',
    color: '#000'
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)'
  },
  buttonTouchable: {
    padding: 16
  }
});
