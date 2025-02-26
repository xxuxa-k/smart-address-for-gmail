import { clsx } from 'clsx'

export type GlobalSettingsSwitchSpanProps = {
  active: boolean
}
export const GlobalSettingsSwitchSpan = ({ active }: GlobalSettingsSwitchSpanProps) => (
  <span
    className={clsx(
      "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
      active ? 'translate-x-6' : 'translate-x-1'
    )}/>
)
