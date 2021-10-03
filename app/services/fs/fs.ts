/* eslint-disable react-native/split-platform-components */
import dayjs from 'dayjs'
import rnfs from 'react-native-fs'
import { PermissionsAndroid, Platform } from "react-native";
import CameraRoll from "@react-native-community/cameraroll";

async function hasFSAndroidPermission() {
  const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;

  const hasPermission = await PermissionsAndroid.check(permission);
  if (hasPermission) {
    return true;
  }

  const status = await PermissionsAndroid.request(permission);
  return status === 'granted';
}

export async function saveQRToImage(data: string): Promise<boolean> {
  if (!data || data === undefined || data == null)
    return false
  try {
    const uri = rnfs.CachesDirectoryPath + `/qr-code-${dayjs().format('YYYY-MM-DD')}.png`
    if (Platform.OS === "android" && !(await hasFSAndroidPermission())) {
      return false
    } else {
      await rnfs.writeFile(uri, data, 'base64')
      await CameraRoll.save(uri, { type:'photo', album: "Safe Pass QR" })
      return true
    }
  } catch (error) {
    console.error("saveQRToImage:", error)
    return false
  }
}
