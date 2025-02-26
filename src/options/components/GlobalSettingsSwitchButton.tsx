import { clsx } from 'clsx'

type GlobalSettingsSwitchButtonProps = {
  onClick: () => void
  active: boolean
  label: string
  disabled?: boolean
  disabledLabel?: string
}
export const GlobalSettingsSwitchButton = ({
  onClick,
  active,
  label,
  disabled = false,
  disabledLabel = "",
}: GlobalSettingsSwitchButtonProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <label
          className={clsx(
            "text-base font-medium",
            disabled ? "text-gray-400" : "text-gray-700"
          )}>
          { disabled ?? disabled ? disabledLabel : label }
        </label>
        <button
          onClick={onClick}
          disabled={disabled}
          className={clsx(
            "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none",
            disabled && "opacity-50 cursor-not-allowed",
            active ? 'bg-blue-600' : 'bg-gray-200'
          )}>
          <span
            className={clsx(
              "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
              active ? 'translate-x-6' : 'translate-x-1'
            )}/>
        </button>
      </div>
    </div>
  )
}
