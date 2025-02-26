import { useEffect } from 'react';
import { sendToBackground } from "@plasmohq/messaging"

function IndexPopup() {
  useEffect(() => {
    (async () => {
      await sendToBackground({
        name: "openOption",
      })
    })()
  }, [])
  return (
    <>Dummy Popup</>
  )
}

export default IndexPopup;
