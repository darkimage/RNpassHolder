import React, { useEffect } from "react"
import { observer } from "mobx-react-lite"
import { KitHeader, KitThemeSwitch, KitTitle, Screen } from "../../components"
// import { useNavigation } from "@react-navigation/native"
import { useStores } from "../../models"
import { Layout, StyleService, Text, useStyleSheet } from "@ui-kitten/components"
import { testKeychain, testREALM } from "../../library-tests"

export const HomeScreen = observer(function HomeScreen() {
  const styles = useStyleSheet(styleScreen)
  const {lockedStore} = useStores()

  useEffect(() => {
    lockedStore.setLocked(false)
    const testLibraries = async () => {
      console.log("================== TESTING LIBRARIES =================")
      await testREALM()
      await testKeychain() 
      console.log("================ TESTING LIBRARIES END ===============")
    }
    testLibraries()
  }, [])

  return (
    <Screen style={styles.ROOT} preset="scroll" backgroundColor={'transparent'}>
      <Layout style={styles.ROOT}>
        <KitHeader setStatusBar={!lockedStore.locked} title={<KitTitle />} accessoryLeft={<KitThemeSwitch />} />
        <Layout style={styles.LAYOUT}>
          <Text category="h3">Test</Text>
        </Layout>
      </Layout>
    </Screen>
  )
})

const styleScreen = StyleService.create({
  ROOT: {
    flex: 1,
    backgroundColor: 'background-basic-color-4'
  },
  LAYOUT: {
    zIndex: -1,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0000000'
  }
})