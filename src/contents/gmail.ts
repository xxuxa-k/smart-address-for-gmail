import * as InboxSDK from '@inboxsdk/core';
import type { PlasmoCSConfig } from "plasmo"
import { sendToBackground } from "@plasmohq/messaging"
import {
  STORAGE_KEYS,
  type CopyRule,
} from '~types';

export const config: PlasmoCSConfig = {
  matches: [ "https://mail.google.com/*", "https://inboxsdk.google.com/*" ],
  run_at: "document_end",
}


async function main() {
  const inboxsdk = await InboxSDK.load(2, process.env.PLASMO_PUBLIC_INBOXSDK_APP_ID!)

  inboxsdk.Compose.registerComposeViewHandler((composeView) => {
    // const composeNoticeView = composeView.addComposeNotice()
    // composeNoticeView.el.innerHTML = "Smart address is working"

    composeView.on("fromContactChanged", (event) => {
      (async () => {
        const currentFrom = event.contact.emailAddress
        const [loadGlobalSettingsResult, loadCopyRulesResult] = await Promise.all([
          sendToBackground({ name: "loadGlobalSettings" }),
          sendToBackground({ name: "loadCopyRules" }),
        ])
        if (STORAGE_KEYS.GLOBAL_SETTINGS in loadGlobalSettingsResult) {
          const addRules = { cc: new Set<string>(), bcc: new Set<string>() }
          if (STORAGE_KEYS.COPY_RULES in loadCopyRulesResult) {
            const copyRules: CopyRule[] = loadCopyRulesResult[STORAGE_KEYS.COPY_RULES]
            copyRules
            .filter(rule => rule.enabled && rule.fromAddress === currentFrom)
            .forEach(rule => {
                if (rule.copyType === "cc") {
                  addRules.cc.add(rule.targetAddress)
                }
                if (rule.copyType === "bcc") {
                  addRules.bcc.add(rule.targetAddress)
                }
            })
          }
          const globalSettings = loadGlobalSettingsResult[STORAGE_KEYS.GLOBAL_SETTINGS]
          if (globalSettings.enableCc) {
            const ccSet = new Set<string>()
            composeView.getCcRecipients().forEach(cc => ccSet.add(cc.emailAddress))
            if (globalSettings.useFromAsDefaultCc) {
              ccSet.add(event.contact.emailAddress)
            }
            composeView.setCcRecipients([...ccSet, ...addRules.cc])
          }
          if (globalSettings.enableBcc) {
            const bccSet = new Set<string>()
            composeView.getBccRecipients().map(bcc => bccSet.add(bcc.emailAddress))
            if (globalSettings.useFromAsDefaultBcc) {
              bccSet.add(event.contact.emailAddress)
            }
            composeView.setBccRecipients([...bccSet, ...addRules.bcc])
          }
        }
      })()
    })
  });
}

main()

