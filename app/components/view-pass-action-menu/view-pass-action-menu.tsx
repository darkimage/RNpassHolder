import * as React from "react"
import { StyleProp, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { Icon, MenuItem, OverflowMenu, TopNavigationAction } from "@ui-kitten/components"
import { useState } from "react"
import { translate } from "../../i18n"
import { useStores } from "../../models"

const BurgerIcon = (props) => (
  <Icon {...props} name="more-vertical" />
)

export interface ViewPassActionMenuProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>,
  onSave?: () => void,
  onDelete?: () => void,
  onSetExpiration?: () => void,
  onSetFavorite?: () => void,
  onRemoveFavorite?: () => void,
}

/**
 * Describe your component here
 */
export const ViewPassActionMenu = observer(function ViewPassActionMenu(props: ViewPassActionMenuProps) {

  const [visible, setVisible] = useState(false);
  const {favoritePassStore, currentPassStore} = useStores()

  const onItemSelect = () => {
    setVisible(false);
  };

  const renderNavAction = () => (
    <TopNavigationAction
      {...props}
      icon={BurgerIcon}
      onPress={() => setVisible(true)}
    />
  )

  const isFavorite = currentPassStore.id === favoritePassStore.id

  return (
    <OverflowMenu
      anchor={renderNavAction}
      visible={visible}
      onSelect={onItemSelect}
      onBackdropPress={() => setVisible(false)}>
      <MenuItem title={translate('viewPass.saveToGallery')} onPress={props?.onSave}/>
      <MenuItem title={translate('viewPass.setExpire')} onPress={props?.onSetExpiration}/>
      <MenuItem title={translate('viewPass.setFavorite')} onPress={props?.onSetFavorite}/>
      {isFavorite && <MenuItem title={translate('viewPass.removeFavorite')} onPress={props?.onRemoveFavorite}/>}
      <MenuItem title={translate('viewPass.delete')} onPress={props?.onDelete}/>
    </OverflowMenu>
  )
})
