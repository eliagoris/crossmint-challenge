import fetch from "node-fetch"
;(async () => {
  const raw = await fetch(
    "https://challenge.crossmint.io//api/map/4af401b6-4a32-4f7a-a8fe-d67730166c4a/goal"
  )

  const res = await raw.json()

  console.log(res)
})()
