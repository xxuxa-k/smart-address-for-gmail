import type { PlasmoMessaging } from "@plasmohq/messaging"

const handler: PlasmoMessaging.MessageHandler = async (_, res) => {
  await chrome.runtime.openOptionsPage()
 
  res.send({
    message: "done"
  })
}
 
export default handler
