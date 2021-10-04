import * as React from "react"
import { StyleProp, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { KitDialog, KitDialogOptions, KitDialogRef } from "../"
import { Calendar, NativeDateService, I18nConfig } from "@ui-kitten/components"
import { useCallback, useEffect, useImperativeHandle, useRef, useState } from "react"
import { translate } from "../../i18n"
import dayjs from "dayjs"
import I18n from "i18n-js"

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

const IT: I18nConfig = {
  dayNames: {
    short: ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"],
    long: ["Domenica", "Lunedi", "Martedi", "Mercoledi", "Giovedi", "Venerdi", "Sabato"],
  },
  monthNames: {
    short: ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"],
    long: [
      "Gennaio",
      "Febbraio",
      "Marzo",
      "Aprile",
      "Maggio",
      "Giugno",
      "Luglio",
      "Agosto",
      "Settembre",
      "Ottobre",
      "Novembre",
      "Dicembre",
    ],
  },
}

const dateService = new NativeDateService('IT', {i18n: IT, startDayOfWeek: 1})

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
          dateService={dateService}
          date={date}
          onSelect={onSelect}
          min={dayjs().subtract(5, 'year').toDate()}
          max={dayjs().add(5, 'year').toDate()}
        />
      }
    />
  )
}, {forwardRef: true})