import type { PlasmoMessaging } from "@plasmohq/messaging"
import { Storage } from "@plasmohq/storage"
import { STORAGE_KEYS } from "~/types"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const storage = new Storage()
  await storage.set(STORAGE_KEYS.COPY_RULES, req.body)
 
  res.send({
    message: "done"
  })
}
 
export default handler
