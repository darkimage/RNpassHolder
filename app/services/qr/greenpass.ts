import { readFile } from 'react-native-fs'
import { Buffer } from 'buffer'
import { decode } from "jpeg-js"
import jsQR from "jsqr"
import pako from 'pako'
import base45 from 'base45-js/lib/base45-js.js'
const CBOR = require('cbor-js')

export interface DecodedQr {
  qr: string,
  data: {
    lastVaccination: string,
    name: string,
    surname: string
    born: string,
    type: "vaccination" | "swab"
  }
}

/**
 * Decodes an Italian Green pass into and object with data from a QR CODE
 * @param uri Android/iOS resource uri
 */
export const decodeFromImage = async (uri: string): Promise<DecodedQr | null>=> { 
  const fileBuffer = Buffer.from(await readFile(uri, 'base64'), 'base64')
  // Get the Uint8Array data
  const greenpassImageData = decode(fileBuffer, { useTArray: true, maxResolutionInMP: 2})
  // Get the encoded string
  const decodedGreenpass = jsQR(new Uint8ClampedArray(greenpassImageData.data), greenpassImageData.width, greenpassImageData.height)
  if (decodedGreenpass)
    return await decodeFromString(decodedGreenpass.data)
  else
    return null
}

/**
 * Decodes an Italian Green pass into and object with data from a string
 */
export const decodeFromString = async (decodedGreenpass: string): Promise<DecodedQr | null> => {
  console.log("decodedGreenpass",decodedGreenpass)
    // Removes HC1:
  const greenpassBody = decodedGreenpass.substr(4)
  console.log("greenpassBody",greenpassBody)
  // Decodes string from base64
  const decodedData = base45.decode(greenpassBody)
  console.log("decodedData",decodedData)
  // zlib unpack it
  const output = pako.inflate(decodedData);
  console.log("output",output)
  // decoded intial data
  const results = CBOR.decode(output.buffer);
  const [headers1, headers2, cborData, signature] = results;
  console.log("results",results)

  // console.log(JSON.stringify(cborData, null, 2));
  // Encode the cborData as an hex Buffer
  const cborDataBuffer = Buffer.from(Object.values<number>(cborData)).buffer
  // Decode the final data
  const greenpassData = CBOR.decode(cborDataBuffer);
  console.log("greenpassData",JSON.stringify(greenpassData, null, 2))
  if (greenpassData) {
    const data = greenpassData["-260"]["1"]
    // eslint-disable-next-line dot-notation
    const type = data["v"] ? "vaccination" : 'swab'
    return {
      qr: decodedGreenpass,
      data: {
        name: data.nam.gn,
        surname: data.nam.fn,
        born: data.dob,
        lastVaccination: type === 'swab' ? data.t[0].sc : data.v[0].dt,
        type: type
      }
    }
  } else {
    return null
  }
}