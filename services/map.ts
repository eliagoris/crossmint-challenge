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

    if (mapGoalResBody?.message) {
      errorMessage += mapGoalResBody?.message
    }

    throw new Error(errorMessage)
  }

  const { goal } = mapGoalResBody
  const {
    map: { content },
  } = mapResBody

  return { goalMap: goal, candidateMap: content }
}

export type ValuesToChange = {
  row: number
  column: number
  goalValue: string
  currentValue: string
}[]

/**
 * A function that will compare the two Megaverses,
 * and return the necessary changes for the candidate Megaverse
 */
export const getValuesToChange = ({
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
  const valuesToChange: ValuesToChange = []

  candidateMap.forEach((mapRowColumns, rowIndex) => {
    mapRowColumns.forEach((mapValue, columnIndex) => {
      const goalValue = goalMap[rowIndex][columnIndex]

      const parsedMapValue = parseCandidateMapValue(mapValue)

      if (parsedMapValue !== goalValue) {
        valuesToChangeCount++

        valuesToChange.push({
          row: rowIndex,
          column: columnIndex,
          goalValue,
          currentValue: parsedMapValue,
        })
      }
    })
  })

  console.log("valuesToChangeCount", valuesToChangeCount)

  return {
    valuesToChangeCount,
    valuesToChange,
  }
}

export type CandidateMapValue = {
  type: number
  color?: string
  direction?: string
} | null

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

    case 2:
      const { direction } = value

      switch (direction) {
        case "up":
          return "UP_COMETH"

        case "down":
          return "DOWN_COMETH"

        case "left":
          return "LEFT_COMETH"

        case "right":
          return "RIGHT_COMETH"
      }

    default:
      return "SPACE"
  }
}

const UPGRADE_API_BASE_URL = "/api/upgrade"

/**
 * Compares Megaverses and makes necessary changes
 */
export const upgradeMap = async ({
  candidateMap,
  goalMap,
  candidateId,
}: {
  candidateMap: CandidateMapContent
  goalMap: string[][]
  candidateId: string
}) => {
  const { valuesToChange } = getValuesToChange({ candidateMap, goalMap })

  const headers = new Headers()
  headers.append("Content-Type", "application/json")

  const body = JSON.stringify({
    valuesToChange,
    candidateId,
  })

  await fetch(UPGRADE_API_BASE_URL, {
    method: "POST",
    body,
    headers,
  })
}

export const getValuesToChangeToReset = ({
  candidateMap,
}: {
  candidateMap: CandidateMapContent
}) => {
  const valuesToChange: ValuesToChange = []

  candidateMap.forEach((mapRowColumns, rowIndex) => {
    mapRowColumns.forEach((mapValue, columnIndex) => {
      const goalValue = "SPACE"
      const parsedMapValue = parseCandidateMapValue(mapValue)

      if (parsedMapValue !== goalValue) {
        valuesToChange.push({
          row: rowIndex,
          column: columnIndex,
          goalValue,
          currentValue: parsedMapValue,
        })
      }
    })
  })

  return valuesToChange
}

/**
 * Resets a Megaverse
 */
export const resetMap = async ({
  candidateMap,
  candidateId,
}: {
  candidateMap: CandidateMapContent
  candidateId: string
}) => {
  const valuesToChange = getValuesToChangeToReset({ candidateMap })

  const headers = new Headers()
  headers.append("Content-Type", "application/json")

  const body = JSON.stringify({
    valuesToChange,
    candidateId,
  })

  await fetch(UPGRADE_API_BASE_URL, {
    method: "POST",
    body,
    headers,
  })
}
