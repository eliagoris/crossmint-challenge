import fetch from "node-fetch"

type MapGoalApiResponseBody = {
  goal: Array<Array<string>>
}

type MapApiResponseBody = {
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
  const mapGoalPromise = fetch(`${MAP_API_BASE_URL}${CANDIDATE_ID}/goal`)
  const mapPromise = fetch(`${MAP_API_BASE_URL}${CANDIDATE_ID}`)

  /** Fetch all requests at once */
  const [mapGoalRes, mapRes] = await Promise.all([mapGoalPromise, mapPromise])

  /** Transpile to JSON */
  const [mapGoalResBody, mapResBody] = (await Promise.all([
    mapGoalRes.json(),
    mapRes.json(),
  ])) as [MapGoalApiResponseBody, MapApiResponseBody]

  /** (Start comparing both maps) */
  const { goal: mapGoalRowsAndColumns } = mapGoalResBody
  const {
    map: { content: mapRowsAndColumns },
  } = mapResBody

  /**
   * Map every row and its columns,
   * compare the value with the candidate map and change the value if necessary
   */
  let valuesToChange = 0
  const changedMap = mapRowsAndColumns.map((mapRowColumns, rowIndex) => {
    const changedRow = mapRowColumns.map((mapValue, columnIndex) => {
      const goalValue = mapGoalRowsAndColumns[rowIndex][columnIndex]

      let valueToReturn = mapValue

      /** Do not consider "SPACE", because there is no API to set this value */
      if (goalValue !== "SPACE" && mapValue !== goalValue) {
        valuesToChange++

        /** Update the value from the goal map. */
        valueToReturn = goalValue
      }

      return valueToReturn
    })

    return changedRow
  })

  console.log(changedMap)

  console.log("valuesToChange", valuesToChange)
})()
