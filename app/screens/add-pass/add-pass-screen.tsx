import React, { useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { Image, Platform, View, ViewStyle } from "react-native"
import { Screen, Text } from "../../components"
import { Button, StyleService, useStyleSheet } from "@ui-kitten/components"
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { readFile } from 'react-native-fs'
import { Buffer } from 'buffer'
import { decode } from "jpeg-js"
import jsQR from "jsqr"
import pako from 'pako'
import base45 from 'base45-js/lib/base45-js.js'
const CBOR = require('cbor-js') 
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../../models"

export const AddPassScreen = observer(function AddPassScreen() {
  
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    launchImageLibrary({mediaType: 'photo'}, async (resp) => {
      if (resp.assets) {
        console.log(resp.assets[0].uri)
        setImage(resp.assets[0])
        // Get the file as raw base binary data
        const fileBuffer = Buffer.from(await readFile(resp.assets[0].uri, 'base64'), 'base64')
        // Get the Uint8Array data
        const greenpassImageData = decode(fileBuffer, { useTArray: true, maxResolutionInMP: 1 })
        // Get the encoded string
        const decodedGreenpass = jsQR(new Uint8ClampedArray(greenpassImageData.data), greenpassImageData.width, greenpassImageData.height)
        // Removes HC1:
        const greenpassBody = decodedGreenpass.data.substr(4)
         // Decodes string from base64
        const decodedData = base45.decode(greenpassBody)
        const output = pako.inflate(decodedData);

        const results = CBOR.decode(output.buffer);

        const [headers1, headers2, cborData, signature] = results;

        console.log(JSON.stringify(cborData, null, 2));
        const cborDataBuffer = Buffer.from(Object.values<number>(cborData)).buffer
        console.log(cborDataBuffer)
        const greenpassData = CBOR.decode(cborDataBuffer);
        console.log(JSON.stringify(greenpassData, null, 2))

      }
    })
  }

  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()
  const styles = useStyleSheet(stylesScreen)

  // Pull in navigation via hook
  // const navigation = useNavigation()
  return (
    <Screen style={styles.ROOT} preset="scroll">
      <Button onPress={pickImage} >Pick an image from camera roll</Button>
      {image != null && <Image source={{ uri: image.uri }} style={styles.IMAGE} />}
    </Screen>
  )
})


const stylesScreen = StyleService.create({
  ROOT: {
    borderRadius: 20,
    display: 'flex',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center'
  },
  IMAGE: {
    width: 200,
    height: 200
  }
})