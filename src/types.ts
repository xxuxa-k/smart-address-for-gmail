import { z } from 'zod'
import { translations } from '~/translations'

export const CopyTypeSchema = z.enum(["cc", "bcc"])
export type CopyType = z.infer<typeof CopyTypeSchema>

export const CopyRuleSchema = z.object({
  fromAddress: z.string().email(),
  targetAddress: z.string().email(),
  copyType: CopyTypeSchema,
  enabled: z.boolean(),
})
export type CopyRule = z.infer<typeof CopyRuleSchema>

export type Language = keyof typeof translations

export const GlobalSettingsSchema = z.object({
  language: z.enum(Object.keys(translations) as [Language, ...Language[]]),
  enableCc: z.boolean(),
  enableBcc: z.boolean(),
  useFromAsDefaultCc: z.boolean(),
  useFromAsDefaultBcc: z.boolean(),
})
export type GlobalSettings = z.infer<typeof GlobalSettingsSchema>

export const DEFAULT_GLOBAL_SETTINGS: GlobalSettings = {
  language: "ja",
  enableCc: false,
  enableBcc: false,
  useFromAsDefaultCc: false,
  useFromAsDefaultBcc: false,
} as const
export const DEFAULT_COPY_RULE: CopyRule = {
  fromAddress: "",
  copyType: "cc",
  targetAddress: "",
  enabled: true,
} as const

export const STORAGE_KEYS = {
  GLOBAL_SETTINGS: "GLOBAL_SETTINGS",
  COPY_RULES: "COPY_RULES",
} as const

export type LanguageOption = {
  value: Language
  label: string
}
export const LANGUAGE_OPTIONS: LanguageOption[] = Object.keys(translations).map(
  (lang): LanguageOption => ({
    value: lang as Language,
    label: lang === "ja" ? "日本語" : "English"
  })
)

