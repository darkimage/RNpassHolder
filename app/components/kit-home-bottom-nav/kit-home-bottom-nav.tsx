import * as React from "react"
import { StyleProp, ViewStyle, StyleSheet } from "react-native"
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

const PersonIcon = (props) => (
  <Icon {...props} name='person-outline'/>
);

const BellIcon = (props) => (
  <Icon {...props} name='bell-outline'/>
);

const EmailIcon = (props) => (
  <Icon {...props} name='email-outline'/>
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
        <Layout style={styles.SCREEN}>{props.children}</Layout>
      </KitHomeBottomNavContex.Provider>
      <BottomNavigation
        style={styles.BOTTOMNAV}
        selectedIndex={selectedIndex}
        onSelect={(index: number) => setSelectedIndex(index)}
      >
        <BottomNavigationTab title={translate('bottomNav.passList')} icon={PersonIcon}/>
        <BottomNavigationTab title={translate('bottomNav.options')} icon={BellIcon}/>
      </BottomNavigation>
    </Layout>
  )
}) as any




const KitHomeBottomNavScreen = observer(function KitHomeBottomNavScreen(props: KitHomeBottomNavScreenProps) {
  const tabContext = React.useContext(KitHomeBottomNavContex)
  return props.tabID === tabContext && props.component
})

KitHomeBottomNav.Screen = KitHomeBottomNavScreen;

const stylesScreen = StyleService.create({
  BOTTOMNAV: {
    marginTop: 8,
  },
  SCREEN: {
    flex: 1,
    backgroundColor: '#0000000'
  },
  LAYOUT: {
    zIndex: -1,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0000000'
  },
});
