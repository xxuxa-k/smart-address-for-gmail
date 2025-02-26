import { clsx } from 'clsx'
import { type LanguageOption, type Language } from '~/types'

export type GlobalSettingsSelectorProps = {
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void
  label: string
  value: Language
  options: LanguageOption[]
}
export const GlobalSettingsSelector = ({ onChange, label, value, options }: GlobalSettingsSelectorProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <label
          className="text-base font-medium text-gray-700">{label}</label>
        <select
          value={value}
          onChange={onChange}
          className={clsx(
            "block w-24 text-base rounded-md border-gray-300 shadow-sm",
            "focus:border-blue-500 focus:ring-blue-500"
          )}
        >
          {options.map((option) => (
            <option value={option.value} key={option.value}>{option.label}</option>
          ))}
        </select>
      </div>
    </div>
  )
}
