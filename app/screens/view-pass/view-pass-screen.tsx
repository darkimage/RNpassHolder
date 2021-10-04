/* eslint-disable react-native/split-platform-components */
/* eslint-disable react-native/no-inline-styles */
import React, { FC, useCallback, useEffect, useRef, useState } from "react"
import { observer } from "mobx-react-lite"
import { BackHandler, Dimensions, ToastAndroid, View } from "react-native"
import { KitBackAction, KitDialog, KitDialogDatePicker, KitDialogDatePickerRef, KitDialogRef, KitHeader, Screen, ViewPassActionMenu, ViewPassPlaceholder, ViewPassQrDetails } from "../../components"
import { StyleService, useStyleSheet, Layout } from "@ui-kitten/components"
import { useStores } from "../../models"
import { getRealmDatabase, QRPass, removePass, setPassExpiration } from "../../services/database"
import { ObjectId } from 'bson'
import { useFocusEffect } from "@react-navigation/core"
import { NavigatorParamList } from "../../navigators"
import { StackScreenProps } from "@react-navigation/stack"
import { translate } from "../../i18n"
import QRCode from "react-native-qrcode-svg"
import { useTheme } from "@react-navigation/native"
import dayjs from "dayjs"
import { saveQRToImage } from "../../services/fs/fs"

export const ViewPassScreen: FC<StackScreenProps<NavigatorParamList, "viewPass">> = observer(function ViewPassScreen({navigation}) {
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()
  const styles = useStyleSheet(styleScreen)
  const navTheme = useTheme()
  const { currentPassStore, statusBarStore, favoritePassStore } = useStores()
  const [pass, setPass] = useState<QRPass>()
  const deleteDialog = useRef<KitDialogRef>()
  const pickerDialog = useRef<KitDialogDatePickerRef>()
  const qrRef = useRef<any>()

  const onBackPress = () => {
    console.log("ViewPassScreen: Navigating home")
    navigation.navigate('home')
    return true
  }

  useEffect(() => {
    let passes: Realm.Results<Realm.Object> = null
    const onPassChanges: Realm.CollectionChangeCallback<any> = (passes, changes) => {
      console.log("ViewPassScreen: handler called")
      changes.newModifications.forEach((index) => {
        if (!pass)
          return
        console.log("ViewPassScreen: modifications:", index)
        const modifiedPass = passes[index] as QRPass
        console.log("ViewPassScreen: onPassChanges: changeDetected:", modifiedPass)
        if (modifiedPass._id.toHexString() === pass._id.toHexString()) {
          console.log("ViewPassScreen: onPassChanges: MODIFIED PASS IS CURRENT PASS... setting new pass")
          setPass(modifiedPass)
        }
      })
    }
    const databaseLink = async () => {
      console.log("ViewPassScreen: set modification handlers")
      const realm = await getRealmDatabase()
      passes = realm.objects("Pass")
      passes.addListener(onPassChanges)
    }
    databaseLink()
    return () => {
      if (passes) {
        console.log("ViewPassScreen: removing realm handler")
        passes.removeListener(onPassChanges)
      }
    }
  }, [pass])

  useFocusEffect(() => {
    statusBarStore.setBgColor(navTheme.colors.background)
  })

  useEffect(() => {
    const getPass = async () => {
      const realm = await getRealmDatabase()
      const passData = realm.objectForPrimaryKey("Pass", new ObjectId(currentPassStore.id))
      // await delay(5000)
      setPass(passData as any)
      console.log("ViewPassScreen: PASS GET:", JSON.stringify(pass, null, 2))
    }
    getPass()
  }, [currentPassStore.id])

  useFocusEffect(
    useCallback(() => {
      BackHandler.addEventListener('hardwareBackPress', onBackPress)
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress)
    }, [])
  )

  const qrSize = Dimensions.get('screen').width - 16

  const onRemoveFavoriteAction = useCallback(() => {
    if (favoritePassStore.id === pass._id.toHexString()) {
      favoritePassStore.setFavorite('')
      ToastAndroid.show(translate('viewPass.favoriteRemoveMessage'), ToastAndroid.SHORT)
    }
  }, [favoritePassStore.id, pass])

  const onDeleteAction = useCallback(() => {
    console.log("ViewPassScreen: onDeleteAction:", pass)
    if (favoritePassStore.id === pass._id.toHexString()) {
      favoritePassStore.setFavorite('')
    }
    removePass(pass)
    currentPassStore.setPass('')
    navigation.navigate('home')
  }, [pass, favoritePassStore.id])

  const onDelete = useCallback(() =>
    deleteDialog.current.show({
    title: translate('common.warning'),
    status: 'danger',
    description: translate('viewPass.deleteDialogMessage'),
    okText: translate('common.yes'),
    cancelText: translate('common.no'),
    onOk: () => {
      deleteDialog.current.dismiss()
      onDeleteAction()
    },
    onCancel: () => deleteDialog.current.dismiss()
  }), [deleteDialog, pass, favoritePassStore.id])

  const onFavoriteAction = useCallback(() => {
    if (pass) {
      favoritePassStore.setFavorite(pass._id.toHexString())
      console.log("ViewPassScreen: onFavoriteAction: id:", favoritePassStore.id)
      ToastAndroid.show(translate('viewPass.favoriteSetMessage'), ToastAndroid.SHORT)
    }
  }, [pass])

  const onSaveToGalleryAction = useCallback(() => {
    if(qrRef.current)
      qrRef.current?.toDataURL?.(async (data) => {
        await saveQRToImage(data)
      })
  }, [pass])

  const onSetExpiration =  useCallback(() => {
    pickerDialog.current.show({
      title: translate('dialogPicker.setExpirationDate'),
      status: 'basic',
      onCancel: () => pickerDialog.current.dismiss(),
      onDateSelect: (date: Date) => {
        console.log("ViewPassScreen: onDateSelect:", date)
        console.log("ViewPassScreen: onDateSelect:", pass)
        setPassExpiration(pass, dayjs(date).format('YYYY-MM-DD'))
        pickerDialog.current.dismiss()
      }
    })
  },[pickerDialog, pass])

  return (
    <View style={styles.ROOT}>
      <KitDialog ref={deleteDialog} />
      <KitDialogDatePicker ref={pickerDialog} />
      <KitHeader
        title={translate("viewPass.title")}
        accessoryLeft={<KitBackAction onPress={() => navigation.navigate('home')} />}
        accessoryRight={
          <ViewPassActionMenu
            onDelete={onDelete}
            onSetExpiration={onSetExpiration}
            onSetFavorite={onFavoriteAction}
            onSave={onSaveToGalleryAction}
            onRemoveFavorite={onRemoveFavoriteAction}
        />}
        setStatusBar={false}
        style={[styles.NAV, {backgroundColor: navTheme.colors.background}]}
        alignment="center"
      />
      <Screen style={[styles.SCREEN, {backgroundColor: navTheme.colors.background}]} preset="fixed">
        {pass &&
          <Layout style={styles.LAYOUT}>
            <View style={styles.QR}>
            <QRCode
              getRef={(svg) => {qrRef.current = svg}}
              size={qrSize}
              value={pass.qr}
            />
            </View>
            <ViewPassQrDetails qr={pass} />
          </Layout>
        }
        <ViewPassPlaceholder show={!pass} />
      </Screen>
    </View>
  )
})


const styleScreen = StyleService.create({
  ROOT: {
    flex: 1,
  },
  SCREEN: {
    flex:1,
    display: 'flex',
    overflow: 'hidden',
  },
  NAV: {
    minHeight: 64,
  },
  LAYOUT: {
    flex: 1,
    backgroundColor: 'transparent',
    // marginHorizontal: 32,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    // marginBottom: 16,
    marginTop: 64,
  },
  QR: {
    marginTop: 16
  }
})
