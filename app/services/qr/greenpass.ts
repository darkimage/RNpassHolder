import { readFile } from 'react-native-fs'
import { Buffer } from 'buffer'
import { decode } from "jpeg-js"
import jsQR from "jsqr"
import pako from 'pako'
import base45 from 'base45-js/lib/base45-js.js'
const CBOR = require('cbor-js')

/**
 * Decodes an Italian Green pass into and object with data from a QR CODE
 * @param uri Android/iOS resource uri
 */
export const decodeFromImage = async (uri: string) => { 
  const fileBuffer = Buffer.from(await readFile(uri, 'base64'), 'base64')
  // Get the Uint8Array data
  const greenpassImageData = decode(fileBuffer, { useTArray: true, maxResolutionInMP: 1 })
  // Get the encoded string
  const decodedGreenpass = jsQR(new Uint8ClampedArray(greenpassImageData.data), greenpassImageData.width, greenpassImageData.height)

  return await decodeFromString(decodedGreenpass.data)
}

/**
 * Decodes an Italian Green pass into and object with data from a string
 */
export const decodeFromString = async (decodedGreenpass: string) => {
    // Removes HC1:
    const greenpassBody = decodedGreenpass.substr(4)
    // Decodes string from base64
    const decodedData = base45.decode(greenpassBody)
    // zlib unpack it
    const output = pako.inflate(decodedData);
    // decoded intial data
    const results = CBOR.decode(output.buffer);
    const [headers1, headers2, cborData, signature] = results;
  
    // console.log(JSON.stringify(cborData, null, 2));
    // Encode the cborData as an hex Buffer
    const cborDataBuffer = Buffer.from(Object.values<number>(cborData)).buffer
    // Decode the final data
    const greenpassData = CBOR.decode(cborDataBuffer);
    return greenpassData
}