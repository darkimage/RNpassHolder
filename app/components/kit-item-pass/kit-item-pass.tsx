import * as React from "react"
import { StyleProp, View, ViewStyle, StyleSheet } from "react-native"
import { observer } from "mobx-react-lite"
import { Card, StyleService, Text, useStyleSheet, useTheme, Icon } from "@ui-kitten/components"
import QRCodeIcon from "../../../assets/svg/qr-code-icon.svg"
import { QRPass } from "../../services/database"
import dayjs from "dayjs"
import { useStores } from "../../models"
import { useCallback, useMemo } from "react"
import { EvaStatus } from "@ui-kitten/components/devsupport"

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
  const { style, passData, onPress } = props
  const styles = useStyleSheet(styleComp)
  const theme = useTheme()
  const { favoritePassStore } = useStores()

  const renderFooter = useCallback(() => {
    if (!hasData)
      return null
    const passDate = (passData as QRPass)?.lastVaccination
    return (
      <View style={styles.FOOTER}>
        <Text category="s2" appearance="hint">{
          dayjs(passDate).format('DD/MM/YYYY')
        }</Text>
      </View>
    )
  },[passData])

  const onPressItem = useCallback(() => {
    if ((passData as QRPass)?._id) {
      onPress?.(passData as QRPass)
    }
  }, [props])

  const hasData = !(passData as any)?.empty

  const status: EvaStatus = useMemo(() => {
    console.log("KitItemPass: status: evaluating STATUS")
    if (hasData) {
      const pass = (passData as QRPass)
      if (pass.expires === '')
        return "basic"
      else {
        if (dayjs().isAfter(dayjs(pass.expires)))
          return "danger"
        else
          return "success"
      }
    } else {
      return "basic"
    }
  }, [passData])

  const codeColor = useMemo(() => {
    if (hasData) {
      const pass = (passData as QRPass)
      switch (pass.type) {
        case "vaccination":
          return theme['color-success-transparent-600']
        case "swab":
          return theme['color-info-transparent-600']
      }
    } else {
      return null
    }
  }, [passData])

  const renderFavorite = useMemo(() => {
    if (!hasData)
      return null
    const pass = (passData as QRPass)
    const isFavorite = favoritePassStore.id === pass._id.toHexString()
    return (
      isFavorite && <Icon style={styles.FAVORITEICON} fill={theme["color-warning-400"]} name="star" />
    )
  }, [passData, favoritePassStore.id])

  return (hasData ?
    <Card
      style={[styles.ROOT,style]}
      status={status}
      footer={renderFooter}
      onPress={onPressItem}
    >
      <View style={styles.BODY}>
        <View style={styles.FAVORITE}>
          {renderFavorite}
        </View>
        <QRCodeIcon
          style={styles.ICON}
          fill={codeColor}
          width={64}
          height={64}
        />
      </View>
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
    marginVertical: 16,
    zIndex: -1,
  },
  FOOTER: {
    // flex: 1,
    paddingVertical: 4,
    alignItems: 'center'
  },
  BODY: {
    position: 'relative'
  },
  EMPTY: {
    opacity: 0
  },
  EMPTYCONTENT: {
    width: 64,
    height: 64
  },
  FAVORITE: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  FAVORITEICON: {
    width: 32,
    height: 32,
    // marginRight: -16
  }
})