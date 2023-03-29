/** Map API service */

const MAP_API_BASE_URL = "https://challenge.crossmint.io/api/map/"

type MapGoalApiResponseBody = MapApiErrorResponseBody & {
  goal: Array<Array<string>>
}

export type CandidateMapContent = Array<Array<CandidateMapValue>>

type MapApiResponseBody = MapApiErrorResponseBody & {
  map: {
    content: CandidateMapContent
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
  candidateMap: CandidateMapContent
  goalMap: string[][]
}) => {
  /**
   * Map every row and its columns,
   * compare the value with the goal map and return a valid value
   */
  let valuesToChangeCount = 0
  const validMap = candidateMap.map((mapRowColumns, rowIndex) => {
    const changedRow = mapRowColumns.map((mapValue, columnIndex) => {
      const goalValue = goalMap[rowIndex][columnIndex]

      const parsedMapValue = parseCandidateMapValue(mapValue)

      let valueToReturn = parsedMapValue

      /** Do not consider "SPACE", because there is no API to set this value */
      if (parsedMapValue !== goalValue) {
        valuesToChangeCount++

        /** Update the value from the goal map. */
        valueToReturn = goalValue
      }

      return valueToReturn
    })

    return changedRow
  })

  console.log(validMap)

  console.log("valuesToChangeCount", valuesToChangeCount)

  return {
    valuesToChangeCount,
    validMap,
  }
}

export type CandidateMapValue = { type: number; color?: string } | null

/**
 * Turn a map value from the candidate Megaverse into an equivalent value from the goal Megaverse
 * So that they can be compared and rendered equally
 */
export const parseCandidateMapValue = (value: CandidateMapValue) => {
  if (!value) return "SPACE"

  const { type } = value

  switch (type) {
    case 0:
      return "POLYANET"

    case 1:
      const { color } = value
      switch (color) {
        case "blue":
          return "BLUE_SOLOON"

        case "red":
          return "RED_SOLOON"

        case "white":
          return "WHITE_SOLOON"

        case "purple":
          return "PURPLE_SOLOON"
      }

    default:
      return "RIGHT_COMETH"
  }
}

const UPGRADE_API_BASE_URL = "/api/upgrade"

/**
 * Compares Megaverses and makes necessary changes
 */
export const upgradeMap = async ({
  candidateMap,
  goalMap,
}: {
  candidateMap: CandidateMapContent
  goalMap: string[][]
}) => {
  const { validMap } = getUpdatedMap({ candidateMap, goalMap })

  let polyanetsToCreate: { rowIndex: number; columnIndex: number }[] = []
  validMap.map((row, rowIndex) =>
    row.map((value, columnIndex) => {
      if (value === "POLYANET") {
        polyanetsToCreate.push({ rowIndex, columnIndex })
      }
    })
  )

  /** Create all Polyanets */
  const headers = new Headers()
  headers.append("Content-Type", "application/json")

  const body = JSON.stringify({
    polyanetsToCreate,
  })

  await fetch(UPGRADE_API_BASE_URL, {
    method: "POST",
    body,
    headers,
  })
}
