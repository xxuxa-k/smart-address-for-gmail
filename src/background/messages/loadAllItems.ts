import type { PlasmoMessaging } from "@plasmohq/messaging"
import { Storage } from "@plasmohq/storage"

const handler: PlasmoMessaging.MessageHandler = async (_, res) => {
  const storage = new Storage()
  const allItem = await storage.getAll()
 
  res.send({
    allItem
  })
}
 
export default handler
