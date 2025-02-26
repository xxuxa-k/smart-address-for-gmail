export type GlobalSettingsLabelProps = { label: string }

export const GlobalSettingsLabel = ({ label }: GlobalSettingsLabelProps) => (
  <label
    className="text-base font-medium text-gray-700">
    {label}
  </label>
)
