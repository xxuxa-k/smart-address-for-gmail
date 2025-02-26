import { useEffect, useState } from "react"
import clsx from "clsx"
import { Plus, Save, Trash2 } from "lucide-react"
import { sendToBackground } from "@plasmohq/messaging"
import {
  type GlobalSettings,
  type CopyRule,
  type Language,
  STORAGE_KEYS,
  LANGUAGE_OPTIONS,
  DEFAULT_GLOBAL_SETTINGS,
  DEFAULT_COPY_RULE,
} from "~/types"
import { translations } from "~/translations"
import "../../style.css"
import { GlobalSettingsSelector } from "./components/GlobalSettingsSelector"
import { GlobalSettingsSwitchButtonGroup } from "./components/GlobalSettingsSwitchButtonGroup"

function useSettingsSync(
  globalSettings: GlobalSettings,
  setGlobalSettings: React.Dispatch<React.SetStateAction<GlobalSettings>>,
) {
  useEffect(() => {
    const updates: Partial<GlobalSettings> = {}

    if (!globalSettings.enableCc && globalSettings.useFromAsDefaultCc) {
      updates.useFromAsDefaultCc = false
    }
    if (!globalSettings.enableBcc && globalSettings.useFromAsDefaultBcc) {
      updates.useFromAsDefaultBcc = false
    }

    if (Object.keys(updates).length > 0) {
      setGlobalSettings(prev => ({
        ...prev,
        ...updates,
      }))
    }
  }, [globalSettings])
}

function Option() {
  const [globalSettings, setGlobalSettings] = useState<GlobalSettings>(DEFAULT_GLOBAL_SETTINGS)
  const [copyRules, setCopyRules] = useState<CopyRule[]>([])
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle")

  useSettingsSync(globalSettings, setGlobalSettings)

  useEffect(() => {
    (async () => {
      const [loadGlobalSettingsResult, loadCopyRulesResult] = await Promise.all([
        sendToBackground({ name: "loadGlobalSettings" }),
        sendToBackground({ name: "loadCopyRules" }),
      ])
      if (STORAGE_KEYS.GLOBAL_SETTINGS in loadGlobalSettingsResult) {
        setGlobalSettings(loadGlobalSettingsResult[STORAGE_KEYS.GLOBAL_SETTINGS])
      } else {
        setGlobalSettings(DEFAULT_GLOBAL_SETTINGS)
      }
      if (STORAGE_KEYS.COPY_RULES in loadCopyRulesResult) {
        setCopyRules(loadCopyRulesResult[STORAGE_KEYS.COPY_RULES])
      } else {
        setCopyRules([])
      }
    })()
  }, [])

  useEffect(() => {
    let timer: number
    if (saveStatus === "saved" || saveStatus === "error") {
      timer = window.setTimeout(() => {
        setSaveStatus("idle")
      }, 5000)

      return () => window.clearTimeout(timer)
    }
  }, [saveStatus])

  const handleSave = async () => {
    setSaveStatus("saving")
    await Promise.all([
      sendToBackground({ name: "saveGlobalSettings", body: globalSettings}),
      sendToBackground({ name: "saveCopyRules", body: copyRules }),
    ])
    setSaveStatus("saved")
  }

  const handleAddRule = () => {
    setCopyRules([
      ...copyRules,
      {
        ...DEFAULT_COPY_RULE,
      }
    ])
  }

  const handleDeleteRule = (index: number) => {
    const newRules = [...copyRules]
    newRules.splice(index, 1)
    setCopyRules(newRules)
  }

  const handleUpdateRule = (index: number, field: string, value: string | boolean) => {
    const newRules = [...copyRules]
    newRules[index] = { ...newRules[index], [field]: value }
    setCopyRules(newRules)
  }

  const isValidLanguage = (value: string): value is Language => {
    const validLanguages = Object.keys(translations)
    return validLanguages.includes(value)
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="bg-white rounded-lg shadow-sm mb-6 p-6">
        <h2 className="text-xl font-semibold mb-4">
          {translations[globalSettings.language].globalSettingsTitle}
        </h2>
        <div className="space-y-2">
          <GlobalSettingsSelector
            label={translations[globalSettings.language].language}
            value={globalSettings.language}
            options={LANGUAGE_OPTIONS}
            onChange={(e) => {
              if (isValidLanguage(e.target.value)) {
                setGlobalSettings({ ...globalSettings, language: e.target.value })
              }
            }}
          />
          <GlobalSettingsSwitchButtonGroup
            parentLabel={translations[globalSettings.language].enableCc}
            childLabel={translations[globalSettings.language].useFromAsDefaultCc}
            parentActive={globalSettings.enableCc}
            childActive={globalSettings.useFromAsDefaultCc}
            onParentClick={() => setGlobalSettings({ ...globalSettings, enableCc: !globalSettings.enableCc })}
            onChildClick={() => setGlobalSettings({ ...globalSettings, useFromAsDefaultCc: !globalSettings.useFromAsDefaultCc })}
            childDisabledLabel={translations[globalSettings.language].useFromAsDefaultCcDisabledLabel}
          />
          <GlobalSettingsSwitchButtonGroup
            parentLabel={translations[globalSettings.language].enableBcc}
            childLabel={translations[globalSettings.language].useFromAsDefaultBcc}
            parentActive={globalSettings.enableBcc}
            childActive={globalSettings.useFromAsDefaultBcc}
            onParentClick={() => setGlobalSettings({ ...globalSettings, enableBcc: !globalSettings.enableBcc })}
            onChildClick={() => setGlobalSettings({ ...globalSettings, useFromAsDefaultBcc: !globalSettings.useFromAsDefaultBcc })}
            childDisabledLabel={translations[globalSettings.language].useFromAsDefaultBccDisabledLabel}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold mb-4">
            {translations[globalSettings.language].autoSetRulesTitle}
          </h2>
          <button
            onClick={handleAddRule}
            className={clsx(
              "inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md",
              "hover:bg-blue-700",
              "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
            )}
          >
            <Plus className="w-4 h-4 mr-2" />
            {translations[globalSettings.language].addRuleLabel}
          </button>
        </div>
      </div>

      <div className="p-6 space-y-4">
        {copyRules.map((rule, index) => (
          <div
            key={index}
            className={clsx(
              "p-4 border rounded-lg space-y-4",
              !rule.enabled && "bg-gray-50 opacity-75 border-gray-200 cursor-not-allowed"
            )}
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <label
                  className="block text-base font-medium text-gray-700">
                  {translations[globalSettings.language].addRuleFromAddressLabel}
                </label>
                <input
                  type="email"
                  value={rule.fromAddress}
                  onChange={(e) => handleUpdateRule(index, "fromAddress", e.target.value)}
                  disabled={!rule.enabled}
                  className={clsx(
                    "block w-full text-base rounded-md border-gray-300 shadow-sm",
                    "focus:border-blue-500 focus:ring-blue-500",
                    !rule.enabled && "bg-gray-100 text-gray-500"
                  )}
                  placeholder="from@example.com"
                />
              </div>
              <div className="space-y-2">
                <label
                  className="block text-base font-medium text-gray-700">
                  {translations[globalSettings.language].addRuleTargetAddressLabel}
                </label>
                <input
                  type="email"
                  value={rule.targetAddress}
                  disabled={!rule.enabled}
                  onChange={(e) => handleUpdateRule(index, "targetAddress", e.target.value)}
                  className={clsx(
                    "block w-full text-base rounded-md border-gray-300 shadow-sm",
                    "focus:border-blue-500 focus:ring-blue-500",
                    !rule.enabled && "bg-gray-100 text-gray-500"
                  )}
                  placeholder="to@example.com"
                />
              </div>
            </div>
            <div className="flex justify-between items-end">
              <div className="w-48 space-y-2">
                <label className="block text-base font-medium text-gray-700">
                  {translations[globalSettings.language].addRuleCopyTypeLabel}
                </label>
                <select
                  value={rule.copyType}
                  onChange={(e) => handleUpdateRule(index, "copyType", e.target.value)}
                  className={clsx(
                    "black w-full rounded-md border-gray-300 shadow-sm",
                    "focus:border-blue-500 focus:ring-blue-500",
                    !rule.enabled && "bg-gray-100 text-gray-500"
                  )}
                >
                  <option value="cc">CC</option>
                  <option value="bcc">BCC</option>
                </select>
              </div>
              <div className="flex justify-end items-center gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700">
                    { rule.enabled
                      ? translations[globalSettings.language].addRuleActiveLabel
                      : translations[globalSettings.language].addRuleInactiveLabel }
                  </label>
                  <button
                    onClick={() => handleUpdateRule(index, "enabled", !rule.enabled)}
                    className={clsx(
                      "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none",
                      rule.enabled ? 'bg-blue-600' : 'bg-gray-200'
                    )}
                  >
                    <span
                      className={clsx(
                        "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                        rule.enabled ? 'translate-x-6' : 'translate-x-1'
                      )}
                    />
                  </button>
                </div>

                <button
                  onClick={() => handleDeleteRule(index)}
                  className="p-2 text-red-600 hover:text-red-700 focus:outline-none"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {copyRules.length === 0 && (
          <div className="text-center text-gray-500 py-4">
            {translations[globalSettings.language].noRulesMessage}
          </div>
        )}
      </div>

      {saveStatus === "saved" && (
        <div className="w-full bg-green-50 text-green-800 p-4 rounded-md">
          {translations[globalSettings.language].savedSuccessfullyMessage}
        </div>
      )}
      {saveStatus === 'error' && (
        <div className="w-full bg-red-50 text-red-800 p-4 rounded-md">
          {translations[globalSettings.language].saveFailedMessage}
        </div>
      )}

      <div className="flex flex-col items-end gap-4">
        <button
          onClick={handleSave}
          disabled={saveStatus === "saving"}
          className={clsx(
            "inline-flex items-center px-4 py-2 text-white rounded-md",
            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
            saveStatus === 'saving'
              ? 'bg-blue-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 transition-colors duration-200'
          )}
        >
          <Save className="w-4 h-4 mr-2" />
          {saveStatus === 'saving'
            ? translations[globalSettings.language].savingLabel
            : translations[globalSettings.language].saveLabel}
        </button>
      </div>
    </div>
  )
}

export default Option

