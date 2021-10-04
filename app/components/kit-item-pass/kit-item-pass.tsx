import * as React from "react"
import { StyleProp, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { Card, StyleService, Text, useStyleSheet } from "@ui-kitten/components"
import QRCodeIcon from "../../../assets/svg/qr-code-icon.svg"
import { QRPass } from "../../services/database"
import dayjs from "dayjs"
import { useStores } from "../../models"
import { useCallback } from "react"
import { navigate } from "../../navigators"

export interface KitItemPassProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
  onPress?: (pass: QRPass) => void 
  passData: QRPass | {empty: boolean},
}

/**
 * Describe your component here
 */
export const KitItemPass = observer(function KitItemPass(props: KitItemPassProps) {
  const { style } = props
  const styles = useStyleSheet(styleComp)

  const renderFooter = () => (
    <View style={styles.FOOTER}>
      <Text category="s2" appearance="hint">{dayjs().format('DD/MM/YY')}</Text>
    </View>
  )

  const onPressItem = useCallback(() => {
    if ((props.passData as QRPass)?._id) {
      props?.onPress?.(props.passData as QRPass)
    }
  }, [props])

  return (!(props.passData as any)?.empty ?
    <Card
      style={[styles.ROOT,style]}
      status='success'
      footer={renderFooter}
      onPress={onPressItem}
    >
      <QRCodeIcon
        style={styles.ICON}
        fill="#000"
        width={64}
        height={64}
      />
    </Card> :
    <View style={[styles.ROOT, styles.EMPTY]}>
    <Card>
      <View style={[styles.ICON, styles.EMPTYCONTENT]} />
    </Card>
    </View>
  )
})

const styleComp = StyleService.create({
  ROOT: {
    flex: 0,
    alignSelf: 'flex-start',
    elevation: 12,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  ICON: {
    marginHorizontal: 32,
    marginVertical: 16
  },
  FOOTER: {
    // flex: 1,
    paddingVertical: 4,
    alignItems: 'center'
  },
  EMPTY: {
    opacity: 0
  },
  EMPTYCONTENT: {
    width: 64,
    height: 64
  }
})