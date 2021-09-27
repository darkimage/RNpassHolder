import React, { useState } from "react"
import { observer } from "mobx-react-lite"
import { FlatList, FlatListProps, View, ViewStyle } from "react-native"
import { KitField, KitFieldProps, Screen } from "../../components"
import { StyleService, useStyleSheet, Text, Toggle, Divider } from "@ui-kitten/components"
import { types } from "@babel/core"
import { useStores } from "../../models"
import { translate } from "../../i18n"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../../models"

const OptionsShowFavoriteToggle = observer(() => {
  const { optionShowFavoriteStore } = useStores()

  return (
    <Toggle
      checked={optionShowFavoriteStore.show}
      onChange={(checked) => {
        optionShowFavoriteStore.setAlwaysShowFavorite(checked)
      }}
    />
  )
})

interface OptionListItem extends KitFieldProps{
  key: string | number
}

const optionsData: Array<OptionListItem> = [
  {
    key: 'AlwayShowFav',
    label: translate('options.AlwayShowFav'),
    accessoryRight: <OptionsShowFavoriteToggle />
  }
]

export const OptionsScreen = observer(function OptionsScreen() {
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()
  const styles = useStyleSheet(stylesScreen)

  const renderItem = (props: { item: KitFieldProps, index: number, separators }) => {
    return (
      <View style={styles.ITEMROOT}>
        <KitField {...props.item} />
      </View>
    )
  }

  // Pull in navigation via hook
  // const navigation = useNavigation()
  return (
    <Screen style={styles.ROOT} preset="fixed">
      <FlatList
        style={styles.LISTROOT}
        data={optionsData}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <Divider style={styles.ITEMDIVIDER} />}
      />
    </Screen>
  )
})



const stylesScreen = StyleService.create({
  ROOT: {
    // width: 400
    width: '100%',
    heigth: '100%'
  },
  ITEMROOT: {
    backgroundColor: 'background-basic-color-2',
    marginHorizontal: 16,
    paddingHorizontal: 8,
    borderRadius: 10,
    elevation: 6,
    marginVertical: 8,
  },
  ITEMDIVIDER: {
    marginVertical: 4
  },
  LISTROOT: {
    paddingTop: 64
  }
})