/** Map API service */

const MAP_API_BASE_URL = "https://challenge.crossmint.io/api/map/"

type MapGoalApiResponseBody = MapApiErrorResponseBody & {
  goal: Array<Array<string>>
}

type MapApiResponseBody = MapApiErrorResponseBody & {
  map: {
    content: Array<Array<string>>
  }
}

type MapApiErrorResponseBody = {
  error: true
  message: string
}

/** Fetches and returns the candidate map and the goal map. */
export const getMaps = async ({ candidateId }: { candidateId: string }) => {
  /** Fetch all requests at once */
  const [mapGoalRes, mapRes] = await Promise.all([
    fetch(`${MAP_API_BASE_URL}${candidateId}/goal`),
    fetch(`${MAP_API_BASE_URL}${candidateId}`),
  ])

  /** Transpile to JSON */
  const [mapGoalResBody, mapResBody] = (await Promise.all([
    mapGoalRes.json(),
    mapRes.json(),
  ])) as [MapGoalApiResponseBody, MapApiResponseBody]

  /** Validate request */
  if (!mapGoalRes?.ok || !mapRes?.ok) {
    let errorMessage = "Couldn't fetch the maps. "

    /** Consider message from the API */
    if (mapResBody?.message) {
      errorMessage += mapResBody?.message
    }

    throw new Error(errorMessage)
  }

  const { goal } = mapGoalResBody
  const {
    map: { content },
  } = mapResBody

  return { goalMap: goal, candidateMap: content }
}

/**
 * A function that will compare the two Megaverses,
 * and return a valid map for the candidate
 */
export const getUpdatedMap = ({
  candidateMap,
  goalMap,
}: {
  candidateMap: string[][]
  goalMap: string[][]
}) => {
  /** (Start comparing both maps) */
  /**
   * Map every row and its columns,
   * compare the value with the candidate map and change the value if necessary
   */
  let valuesToChange = 0
  const validMap = candidateMap.map((mapRowColumns, rowIndex) => {
    const changedRow = mapRowColumns.map((mapValue, columnIndex) => {
      const goalValue = goalMap[rowIndex][columnIndex]

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

  console.log(validMap)

  console.log("valuesToChange", valuesToChange)

  return {
    valuesToChange,
    validMap,
  }
}
