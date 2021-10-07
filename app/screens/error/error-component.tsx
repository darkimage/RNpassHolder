import React, { ErrorInfo, useEffect, useRef } from "react"
import { View, ScrollView } from "react-native"
import { StyleService, useStyleSheet, Text, Button, Icon, useTheme } from "@ui-kitten/components"
import { translate } from "../../i18n"

// Uncomment this and the Text component in the ErrorComponent if
// you want to see a backtrace in your error reporting screen.
// const CONTENT_BACKTRACE: TextStyle = {
//   color: color.dim,
// }

export interface ErrorComponentProps {
  error: Error
  errorInfo: ErrorInfo
  onReset(): void
}

/**
 * Describe your component here
 */
export const ErrorComponent = (props: ErrorComponentProps) => {

  const theme = useTheme()
  const styles = useStyleSheet(styleComp)
  const errorIconRef= useRef<Icon<any>>()

  useEffect(() => {
    if(errorIconRef.current)
      errorIconRef.current.startAnimation();
  }, [])

  return (
    <View style={styles.CONTAINER}>
      <Icon ref={errorIconRef} fill={theme['color-danger-500']} style={styles.ICON} name="alert-circle" animation="pulse" animationConfig={{ cycles: Infinity }}/>
      <Text style={styles.TITLE_ERROR}>{translate("errorScreen.title")}</Text>
      <Text appearance="hint" style={styles.FRIENDLY_SUBTITLE}>{translate("errorScreen.friendlySubtitle")}</Text>
      { __DEV__ && <View style={styles.ERROR_DETAILS_CONTAINER}>
        <ScrollView>
          <Text selectable style={styles.CONTENT_ERROR}>{`${props.error}`}</Text>
          {/* <Text selectable style={CONTENT_BACKTRACE} text={`${props.errorInfo.componentStack}`} /> */}
        </ScrollView>
      </View>}
      <Button status='warning' style={styles.BTN_RESET} onPress={props.onReset}>{translate("errorScreen.reset")}</Button>
    </View>
  )
}


const styleComp = StyleService.create({
  CONTAINER: {
    alignItems: "center",
    justifyContent: 'center',
    backgroundColor: 'background-basic-color-1',
    flex: 1,
    padding: 16,
    paddingVertical: 50,
  },
  ICON: {
    marginTop: 64,
    width: 64,
    height: 64,
  },
  ERROR_DETAILS_CONTAINER: {
    width: "100%",
    maxHeight: "60%",
    backgroundColor: 'background-basic-color-4',
    marginVertical: 15,
    paddingHorizontal: 10,
    paddingBottom: 15,
    borderRadius: 6,
  },
  BTN_RESET: {
    paddingHorizontal: 40,
    marginTop: 'auto',
    marginBottom:'auto',
  },
  TITLE_ERROR: {
    color: 'color-danger-500',
    fontWeight: "bold",
    paddingVertical: 15,
  },
  FRIENDLY_SUBTITLE: {
    fontWeight: "normal",
    paddingVertical: 15,
  },
  CONTENT_ERROR: {
    color: 'color-danger-500',
    fontWeight: "bold",
    paddingVertical: 15,
  }
})