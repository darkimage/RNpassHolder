import * as React from "react"
import { Animated, StyleProp, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import {Modal, Spinner, StyleService, useStyleSheet} from '@ui-kitten/components'

export interface KitModalLoadingProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
  show?: boolean,
  completed?: boolean
}

/**
 * Describe your component here
 */
export const KitModalLoading = observer(function KitModalLoading(props: KitModalLoadingProps) {
  const { style } = props
  const styles = useStyleSheet(styleComp)
  const fadeIn = React.useRef(new Animated.Value(0)).current

  React.useEffect(() => {
    if (props.show) {
      Animated.timing(fadeIn, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true
      }).start()
    } else {
      fadeIn.setValue(0)
    }
  }, [props.show])

  return (
    <Modal
      backdropStyle={styles.BACKDROP}
      visible={props.show}
    >
      <Animated.View style={{opacity: fadeIn}}>
        <Spinner size="giant" status="basic" />
      </Animated.View>
    </Modal>
  )
})

const styleComp = StyleService.create({
  BACKDROP: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
})
