import * as React from "react"
import { StyleProp, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { KitDialog, KitDialogOptions, KitDialogRef } from "../"
import { Calendar } from "@ui-kitten/components"
import { useCallback, useEffect, useImperativeHandle, useRef, useState } from "react"
import { translate } from "../../i18n"
import dayjs from "dayjs"

export interface KitDialogDatePickerProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
}

export interface KitDialogDatePickerOptions extends KitDialogOptions {
  onDateSelect?: (date: Date) => void
}

export interface KitDialogDatePickerRef extends KitDialogRef {
  show: (opts: KitDialogDatePickerOptions) => void,
}

/**
 * Describe your component here
 */
export const KitDialogDatePicker = observer(function KitDialogDatePicker(props: KitDialogDatePickerProps, ref: React.ForwardedRef<any>) {
  const { style } = props
  const [date, setDate] = useState(new Date())
  const dialog = useRef<KitDialogRef>()
  const [options, setOptions] = useState(null)

  useImperativeHandle(ref, () => ({
    show: (opts: KitDialogDatePickerOptions) => {
      console.log("KitDialogDatePicker: SHOW CALLED")
      const newOpts: KitDialogOptions = {
        ...opts,
        okText: translate('dialogPicker.set'),
        onOk: onOk
      }
      setOptions(newOpts)
      dialog.current.show({ ...newOpts })
    },
    dismiss: () => {
      setOptions(null)
      dialog.current.dismiss()
    }
  }), [date])

  useEffect(() => {
    if(options)
      dialog.current.show({ ...options, onOk: onOk })
  }, [date, options])

  const onOk = useCallback(() => {
    console.log("KitDialogDatePicker: onOK:", date)
    options?.onDateSelect?.(date)
  }, [date, options])

  const onSelect = (date: Date) => {
    setDate(date)
  }

  return (
    <KitDialog
      style={style}
      ref={dialog}
      bodyComponent={
        <Calendar
          date={date}
          onSelect={onSelect}
          min={dayjs().subtract(5, 'year').toDate()}
          max={dayjs().add(5, 'year').toDate()}
        />
      }
    />
  )
}, {forwardRef: true})