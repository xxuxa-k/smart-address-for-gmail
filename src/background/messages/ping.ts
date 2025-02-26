import type { PlasmoMessaging } from "@plasmohq/messaging"

async function querySomeApi(id: string): Promise<string> {
  if (!id) {
    return "Hello World"
  }
  return `Hello ${id}`
}
 
const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const message = await querySomeApi(req.body.id)
 
  res.send({
    message
  })
}
 
export default handler
