import * as React from "react"
import { StyleProp, ViewStyle, StyleSheet, View, Animated, useWindowDimensions } from "react-native"
import { observer } from "mobx-react-lite"
import { BottomNavigation, BottomNavigationTab, Icon, Layout, StyleService, useStyleSheet } from "@ui-kitten/components"
import { translate } from "../../i18n"

export interface KitHomeBottomNavProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
  children?: React.ReactNode
}

export interface KitHomeBottomNavScreenProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>,
  tabID: number,
  component: React.ReactElement,
}

const KitHomeBottomNavContex = React.createContext(0)

interface KitHomeBottomNavCompound extends React.FunctionComponent<KitHomeBottomNavProps> {
  Screen: React.FunctionComponent<KitHomeBottomNavScreenProps>
}

const ListIcon = (props) => (
  <Icon {...props} name='list-outline'/>
);

const OptionsIcon = (props) => (
  <Icon {...props} name='options-2'/>
);


/**
 * Describe your component here
 */
export const KitHomeBottomNav: KitHomeBottomNavCompound = observer(function KitHomeBottomNav(props: KitHomeBottomNavProps) {

  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const styles = useStyleSheet(stylesScreen)
  
  return (
    <Layout style={styles.LAYOUT}>
      <KitHomeBottomNavContex.Provider value={selectedIndex}>
        {props.children}
      </KitHomeBottomNavContex.Provider>
      <BottomNavigation
        style={styles.BOTTOMNAV}
        selectedIndex={selectedIndex}
        onSelect={(index: number) => setSelectedIndex(index)}
      >
        <BottomNavigationTab title={translate('bottomNav.passList')} icon={ListIcon}/>
        <BottomNavigationTab title={translate('bottomNav.options')} icon={OptionsIcon}/>
      </BottomNavigation>
    </Layout>
  )
}) as any




const KitHomeBottomNavScreen = observer(function KitHomeBottomNavScreen(props: KitHomeBottomNavScreenProps) {
  const tabContext = React.useContext(KitHomeBottomNavContex)
  const { height, width } = useWindowDimensions();
  const styles = useStyleSheet(stylesScreen)
  const [prevID, setPrevID] = React.useState(props.tabID)
  const slideIn = React.useRef(new Animated.Value(width)).current

  React.useEffect(() => {
    slideIn.setValue(tabContext < prevID ? -width : width)
    if (props.tabID === tabContext) {
      Animated.spring(slideIn,{
        toValue: 0,
        useNativeDriver: true
      }).start((res) => {
        if (res.finished === false) {
          slideIn.setValue(tabContext < prevID ? -width : width)
        }
      });
    }
    setPrevID(tabContext)
  }, [tabContext])

  return (
    props.tabID === tabContext && (
      <Animated.View style={[styles.NAVSCREEN, { transform: [{ translateX: slideIn }] }]}>
      {props.component}
    </Animated.View>
  ))
})

KitHomeBottomNav.Screen = KitHomeBottomNavScreen;

const stylesScreen = StyleService.create({
  BOTTOMNAV: {
    marginTop: 8,
  },
  LAYOUT: {
    zIndex: -1,
    position: 'relative',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0000000'
  },
  NAVSCREEN: {
    flex: 1,
    width: "100%",
    position: 'relative',
  }
});
