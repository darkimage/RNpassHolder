import * as React from "react"
import { Animated, LayoutAnimation, StyleProp, TouchableWithoutFeedback, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { QRPass } from "../../services/database"
import { Divider, Icon, Layout, StyleService, Text, useStyleSheet, useTheme } from "@ui-kitten/components"
import { translate } from "../../i18n"
import { KitDetailField } from ".."
import { useEffect, useRef } from "react"
import dayjs from "dayjs"

const EyeIcon = (props: { hide: boolean, onPress: () => void }) => {
  const styles = useStyleSheet(stylesEye)
  const fadeIn = useRef(new Animated.Value(1)).current
  const theme = useTheme()

  useEffect(() => {
    // fadeIn.setValue(props.hide ? 0 : 1)
    console.log("EyeIcon:", props.hide ? 1 : 0)
    Animated.timing(fadeIn, {
      duration: 500,
      toValue: props.hide ? 1 : 0,
      useNativeDriver: true
    }).start()
  }, [props.hide])
  
  const fillColor = theme['color-basic-600']

  return (
    <TouchableWithoutFeedback onPress={props.onPress}>
      <View style={styles.ROOT}>
        <Animated.View style={[styles.ICON, { opacity: fadeIn.interpolate({ inputRange: [0, 1], outputRange: [0, 1]}) }]}>
          <Icon fill={fillColor} name="eye" />
        </Animated.View>
        <Animated.View style={[styles.ICON, { opacity: fadeIn.interpolate({ inputRange: [0, 1], outputRange: [1, 0]}) }]}>
          <Icon fill={fillColor} name="eye-off"/>
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  )
};

const stylesEye = StyleService.create({
  ROOT: {
    minHeight: 32,
    minWidth: 32,
    maxHeight: 32,
    maxWidth: 32,
    position: 'relative'
  },
  ICON: {
    position: 'absolute',
    minHeight: 32,
    minWidth: 32,
    top: 0,
    left: 0
  }
})


export interface ViewPassQrDetailsProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
  qr: QRPass
}

/**
 * Describe your component here
 */
export const ViewPassQrDetails = observer(function ViewPassQrDetails(props: ViewPassQrDetailsProps) {
  const { style, qr } = props

  const styles = useStyleSheet(stylesComp)
  const [open, setOpen] = React.useState(false)

  const closeStyle = {
    height: 0,
    paddingVertical: 0,
    paddingHorizontal: 0,
  }

  const openStyle = {
    height: 'auto',
    paddingVertical: 16,
    paddingHorizontal: 16,
  }

  return (
    <View style={[styles.ROOT, style]}>
      <Layout style={styles.LAYOUT}>
        <Layout style={styles.HEADER}>
          <EyeIcon
            hide={open}
            onPress={() => {
              LayoutAnimation.configureNext(springProps)
              setOpen(!open)
          }}/>
          <Text category='h6' style={styles.TITLE}>{translate('viewPass.details')}</Text>
        </Layout>
        <Divider />
        <Layout style={[styles.CONTENT, open ? openStyle : closeStyle]}>
          <KitDetailField label={translate('viewPass.nameLabel')} fields={[qr.surname, qr.name]} />
          <KitDetailField label={translate('viewPass.typeLabel')} fields={[translate(`pass.${qr.type}`)]} />
          <KitDetailField label={translate('viewPass.lastLabel')} fields={[dayjs(qr.lastVaccination).format('DD/MM/YYYY')]} />
          {qr.expires !== '' && <KitDetailField label={translate('viewPass.expiresLabel')} fields={[dayjs(qr.expires).format('DD/MM/YYYY')]} />}
        </Layout>
      </Layout>
    </View>
  )
})

const springProps = {
  duration: 700,
  create: { type: "linear", property: "opacity" },
  update: { type: "spring", springDamping: 0.7 },
  delete: { type: "linear", property: "opacity" },
}

const stylesComp = StyleService.create({
  ROOT: {
    flex: 1,
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'background-basic-color-1',
    marginTop: 16,
    position: 'absolute',
    bottom: 0,
    elevation: 12
  },
  LAYOUT: {
    // paddingVertical: 16,
    // paddingHorizontal: 32,
    backgroundColor: 'background-basic-color-1',
  },
  TITLE: {
    marginLeft: 16
  },
  HEADER: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center'
  },
  CONTENT: {
    height: 'auto',
    // minHeight: 100,
  }
})
