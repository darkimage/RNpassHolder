import * as React from "react"
import { Animated, StyleProp, TextStyle, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { Icon, IconProps, StyleService, TopNavigationAction, useStyleSheet, useTheme } from "@ui-kitten/components"
import { ThemeModel, useStores } from "../../models"
import { TouchableHighlight } from "react-native-gesture-handler"

export interface KitThemeSwitchProps extends IconProps<any> {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
}

interface IconSwitchProps extends KitThemeSwitchProps{
  anim: Animated.Value
}

const IconSwitch = (props: IconSwitchProps) => {
  const styles = useStyleSheet(compStyle)
  const theme = useTheme()
  return (
    <View style={styles.container}>
      <Animated.View style={[styles.flip, {
        transform: [{
          rotateY: props.anim.interpolate({ inputRange: [0, 88], outputRange: ['88deg', '0deg'] }),
        },
        {translateY: 8}],
        opacity: props.anim.interpolate({ inputRange: [0, 88], outputRange: [0, 1] }),
        elevation: props.anim.interpolate({ inputRange: [0, 44, 88], outputRange: [0, 12, 0] })
      }]}>
        <Icon name={'sun'} fill={theme['background-alternative-color-1']} {...props}/>
      </Animated.View>
      <Animated.View style={[styles.flip, {
        transform: [{
          rotateY: props.anim.interpolate({ inputRange: [0, 88], outputRange: ['0deg', '88deg'] }),
        },
        {translateY: 8}],
        opacity: props.anim.interpolate({ inputRange: [0, 88], outputRange: [1, 0] }),
        elevation: props.anim.interpolate({ inputRange: [0, 44, 88], outputRange: [0,12,0] })
      }]}>
        <Icon name={'moon'} fill={theme['background-alternative-color-1']} {...props}/>
      </Animated.View>
    </View>
  )
}

/**
 * Describe your component here
 */
export const KitThemeSwitch = observer(function KitThemeSwitch(props: KitThemeSwitchProps) {
  const { themeStore } = useStores()
  const styles = useStyleSheet(compStyle)
  const rot = React.useRef(new Animated.Value(0)).current

  const rotate = () => {

    const anim1 = Animated.timing(rot, {
      toValue: themeStore.current === 'dark' ? 0 : 88,
      duration: 300,
      useNativeDriver: true
    });
    anim1.start()
  }

  return(
    <TopNavigationAction icon={<IconSwitch anim={rot}/>}
      onPress={() => {
        rotate()
        themeStore.setTheme(themeStore.current === 'dark' ? 'light' : 'dark')
      }}
    />
  )
})

const compStyle = StyleService.create({
  flip: {
    // backgroundColor: 'background-basic-color-1',
    borderRadius: 50,
    // elevation: 5,
    shadowColor: 'border-primary-color-5',
    position: 'absolute',
    // left: 0
  },
  container: {
    minHeight: 32,
    minWidth: 32,
  }
})
