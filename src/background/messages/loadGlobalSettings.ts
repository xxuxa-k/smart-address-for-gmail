import type { PlasmoMessaging } from "@plasmohq/messaging"
import { Storage } from "@plasmohq/storage"
import {
  STORAGE_KEYS,
} from "~/types"

const handler: PlasmoMessaging.MessageHandler = async (_, res) => {
  const storage = new Storage()
  const key = STORAGE_KEYS.GLOBAL_SETTINGS
  const result = await storage.get(key)
 
  res.send({
    [key]: result,
  })
}
 
export default handler
