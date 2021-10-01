import * as React from "react"
import { StyleProp, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { Card, Modal, StyleService, useStyleSheet, Text, TextProps, Layout, Button } from "@ui-kitten/components"
import { translate } from "../../i18n"

export interface KitDialogProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>,
}

export interface KitDialogOptions {
  title: string,
  titleProps?: TextProps
  description?: string,
  descriptionProps?: TextProps,
  type?: "error" | "info" | "basic",
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
  const { style } = props
  const styles = useStyleSheet(styleComp)
  const [options, setOptions] = React.useState({} as KitDialogOptions)
  const [show, setShow] = React.useState(false)

  React.useImperativeHandle(ref, () => ({
    show: (opts: KitDialogOptions) => {
      console.log("SHOW CALLED")
      setOptions(opts)
      setShow(true)
    },
    dismiss: () => {
      console.log("DISMISS CALLED")
      setShow(false)
    }
  }))

  const renderHeader = (opts: KitDialogOptions) => (
    <View>
      <Text
        category="h3"
        {...opts.titleProps}
        style={[styles.TITLE, opts.titleProps?.style]}
      >
        {opts.title}
      </Text>
    </View>
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
        status="danger"
        appearance="filled"
        header={renderHeader(options)}
        footer={renderFooter(options)}
        style={styles.ROOT}
      >
        <Text>{options.description}</Text>
      </Card>
    </Modal>
  )
}, {forwardRef: true})

const styleComp = StyleService.create({
  ROOT: {
    minWidth: '70%',
    flex: 1,
    borderRadius: 10,
  },
  TITLE: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: 'color-danger-transparent-200',
    color: 'color-danger-500'
  },
  BACKDROP: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  FOOTER: {
    flex: 1,
    flexDirection: 'row',
    minHeight: 64,
    // paddingHorizontal: 0,
    // paddingVertical: 0,
  },
  BUTTON: {
    flex: 1,
    borderRadius: 0,
    borderWidth: 0
  }
})