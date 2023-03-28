import fetch from "node-fetch"

type MapGoalApiResponse = {
  goal: Array<Array<string>>
}

type MapApiResponse = {
  map: {
    content: Array<Array<string>>
  }
}

const MAP_API_BASE_URL = "https://challenge.crossmint.io/api/map/"
const CANDIDATE_ID = "4af401b6-4a32-4f7a-a8fe-d67730166c4a"

/**
 * A function that will fetch the map goal and the current map of the candidate,
 * compare them both, and make the necessary changes to the candidate map to have it validated
 */
;(async () => {
  const mapGoalRequest = fetch(`${MAP_API_BASE_URL}${CANDIDATE_ID}/goal`)
  const currentMapRequest = fetch(`${MAP_API_BASE_URL}${CANDIDATE_ID}`)

  /** Fetch all requests at once */
  const [mapGoalResponse, currentMapResponse] = await Promise.all([
    mapGoalRequest,
    currentMapRequest,
  ])

  /** Transpile to JSON */
  const [mapGoal, currentMap] = (await Promise.all([
    mapGoalResponse.json(),
    currentMapResponse.json(),
  ])) as [MapGoalApiResponse, MapApiResponse]

  console.log(mapGoal.goal.length)
  console.log(currentMap.map.content.length)
})()
