export * from "@inboxsdk/core/background"

import { Storage } from "@plasmohq/storage"
import { DEFAULT_GLOBAL_SETTINGS, STORAGE_KEYS } from "~/types"

chrome.runtime.onInstalled.addListener((details) => {
  (async () => {
    if (details.reason === "install") {
      const storage = new Storage()
      await storage.clear()
      await storage.set(STORAGE_KEYS.GLOBAL_SETTINGS, DEFAULT_GLOBAL_SETTINGS)

      chrome.runtime.openOptionsPage()
    }
  })()
})
