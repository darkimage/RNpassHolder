import * as React from "react"
import { BackHandler, StyleProp, StyleSheet, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { Card, Modal, StyleService, useStyleSheet, Text, TextProps, Layout, Button, styled } from "@ui-kitten/components"
import { translate } from "../../i18n"
import { useCallback, useImperativeHandle, useState } from "react"
import { useFocusEffect } from "@react-navigation/core"

export interface KitDialogProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>,
}

export interface KitDialogOptions {
  title?: string,
  titleProps?: TextProps
  description?: string,
  descriptionProps?: TextProps,
  status?: "danger" | "info" | "basic",
  cancelText?: string,
  okText?: string
  onCancel?: () => void,
  onOk?: () => void,
  onBackdropPress?: () => void
}

export interface KitDialogRef {
  show: (opts: KitDialogOptions) => void,
  dismiss: () => void
}
/**
 * Describe your component here
 */
export const KitDialog = observer(function KitDialog(props: KitDialogProps, ref: React.ForwardedRef<any>) {
  const styles = useStyleSheet(styleComp)
  const stylesDanger = useStyleSheet(styleCompDanger)
  const stylesInfo = useStyleSheet(styleCompInfo)
  const stylesBasic = useStyleSheet(styleCompBasic)

  const {style} = props
  const [options, setOptions] = useState({} as KitDialogOptions)
  const [show, setShow] = useState(false)

  const getStyleForStatus = (status: string): StyleSheet.NamedStyles<{
    TITLE: unknown;
  }> => {
    switch (status) {
      case "danger":
        return stylesDanger
      case "info":
        return stylesInfo
      default:
        return stylesBasic
    }
  }

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (show) {
          console.log("KitDialog: back pressed show is true hiding")
          setShow(false)
          return true
        } else {
          console.log("KitDialog: back pressed show is false not handling")
          return false
        }
      }

      BackHandler.addEventListener('hardwareBackPress', onBackPress)
      console.log("KitDialog: Added backhandler")

      return () => {
        console.log("KitDialog: Removed Backhandler")
        BackHandler.removeEventListener('hardwareBackPress', onBackPress)
      }
    }, [props, show])
  )

  useImperativeHandle(ref, () => ({
    show: (opts: KitDialogOptions) => {
      console.log("KitDialog: SHOW CALLED")
      setOptions(opts)
      setShow(true)
    },
    dismiss: () => {
      console.log("KitDialog: DISMISS CALLED")
      setShow(false)
    }
  }))

  const renderHeader = (opts: KitDialogOptions) => (opts.title && 
    <View>
      <Text
        category="h3"
        {...opts.titleProps}
        style={[styles.TITLE, getStyleForStatus(opts.status).TITLE, opts.titleProps?.style]}
      >
        {opts.title}
      </Text>
    </View >
  )

  const renderFooter = (opts: KitDialogOptions) => (
    <View>
      <Layout style={styles.FOOTER}>
        {opts?.onCancel &&
          <Button
            appearance="ghost"
            style={styles.BUTTON}
            onPress={opts.onCancel}
          >
            {opts.cancelText ? opts.cancelText : translate('common.cancel')}
          </Button>
        }
        <Button
          appearance="ghost"
          style={styles.BUTTON}
          onPress={opts.onOk}
        >
          {opts.okText ? opts.okText : translate('common.ok')}
        </Button>
      </Layout>
    </View>
  )

  return (
    <Modal
      backdropStyle={styles.BACKDROP}
      visible={show}
      onBackdropPress={options.onBackdropPress} // for testing
    >
      <Card
        appearance="filled"
        status={options.status}
        header={renderHeader(options)}
        footer={renderFooter(options)}
        style={[styles.ROOT, style]}
      >
        <Text>{options.description}</Text>
      </Card>
    </Modal>
  )
}, {forwardRef: true})

const styleComp = StyleService.create({
  ROOT: {
    minWidth: '90%',
    maxWidth: '90%',
    flex: 1,
    borderRadius: 10,
    alignSelf: 'center'
  },
  TITLE: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  BACKDROP: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    // flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center'
  },
  FOOTER: {
    // flex: 1,
    flexDirection: 'row',
    minHeight: 64,
  },
  BUTTON: {
    flex: 1,
    borderRadius: 0,
    borderWidth: 0
  }
})

const styleCompDanger = StyleService.create({
  TITLE: {
    backgroundColor: 'color-danger-transparent-200',
    color: 'color-danger-500'
  }
})

const styleCompInfo = StyleService.create({
  TITLE: {
    backgroundColor: 'color-info-transparent-200',
    color: 'color-info-500'
  }
})

const styleCompBasic = StyleService.create({
  TITLE: {}
})



