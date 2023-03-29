import type { NextApiRequest, NextApiResponse } from "next"
import fetchRetry from "fetch-retry"
import { ValuesToChange } from "@/services/map"

const fetchAPI = fetchRetry(fetch)

const POLYANETS_API_URL = "https://challenge.crossmint.io/api/polyanets"
const SOLOONS_API_URL = "https://challenge.crossmint.io/api/soloons"
const COMETHS_API_URL = "https://challenge.crossmint.io/api/comeths"

type Data = {
  name: string
}

/** API handler to upgrade the candidate Megaverse map */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const {
    valuesToChange,
  }: {
    valuesToChange: ValuesToChange
  } = req.body

  try {
    var headers = new Headers()
    headers.append("Content-Type", "application/json")

    const promises = valuesToChange.map(({ column, goalValue, row }) => {
      const body: {
        row: number
        column: number
        candidateId: string
        color?: string
        direction?: string
      } = {
        row: row,
        column: column,
        candidateId: "4af401b6-4a32-4f7a-a8fe-d67730166c4a",
      }

      let apiUrl = POLYANETS_API_URL

      switch (goalValue) {
        case "POLYANET":
          apiUrl = POLYANETS_API_URL
          break

        case "RIGHT_COMETH":
          apiUrl = COMETHS_API_URL
          body.direction = "right"

          break

        case "UP_COMETH":
          apiUrl = COMETHS_API_URL
          body.direction = "up"
          break

        case "LEFT_COMETH":
          apiUrl = COMETHS_API_URL
          body.direction = "left"
          break

        case "DOWN_COMETH":
          apiUrl = COMETHS_API_URL
          body.direction = "down"
          break

        case "BLUE_SOLOON":
          apiUrl = SOLOONS_API_URL
          body.color = "blue"
          break

        case "RED_SOLOON":
          apiUrl = SOLOONS_API_URL
          body.color = "red"
          break

        case "WHITE_SOLOON":
          apiUrl = SOLOONS_API_URL
          body.color = "white"
          break

        case "PURPLE_SOLOON":
          apiUrl = SOLOONS_API_URL
          body.color = "purple"
          break

        default:
          break
      }

      /**
       * The map API only accepts 10 requests per 10 seconds, so we have to keep retrying.
       */
      return fetchAPI(apiUrl, {
        method: "POST",
        body: JSON.stringify(body),
        headers,
        retries: 10,
        retryDelay: 10000,
        retryOn: [429],
      })
    })

    console.time("Upgrading map")
    await Promise.all(promises)
    console.timeEnd("Upgrading map")

    res.status(200).json({})
  } catch (e) {
    console.log(e)

    res.status(500).json(e + "")
  }
}
