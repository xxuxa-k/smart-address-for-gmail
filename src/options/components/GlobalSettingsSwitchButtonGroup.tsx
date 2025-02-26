import { ChevronRight, } from "lucide-react"
import { GlobalSettingsSwitchButton } from "./GlobalSettingsSwitchButton"

type GlobalSettingsSwitchButtonGroupProps = {
  parentLabel: string
  childLabel: string
  parentActive: boolean
  childActive: boolean
  onParentClick: () => void
  onChildClick: () => void
  childDisabledLabel: string
}
export const GlobalSettingsSwitchButtonGroup = ({
  parentLabel,
  childLabel,
  parentActive,
  childActive,
  onParentClick,
  onChildClick,
  childDisabledLabel,
}: GlobalSettingsSwitchButtonGroupProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <GlobalSettingsSwitchButton
            label={parentLabel}
            active={parentActive}
            onClick={onParentClick}
          />
        </div>
      </div>

      <div className="ml-2 flex items-center space-x-2 border-l-2 border-gray-200 pl-2">
        <ChevronRight className="h-4 w-4 text-gray-400"/>
        <div className="flex-1">
          <GlobalSettingsSwitchButton
            label={childLabel}
            active={childActive}
            onClick={onChildClick}
            disabled={!parentActive}
            disabledLabel={childDisabledLabel}
          />
        </div>
      </div>
    </div>
  )
}
