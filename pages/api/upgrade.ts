import type { NextApiRequest, NextApiResponse } from "next"
import fetchRetry from "fetch-retry"

import { ValuesToChange } from "@/services/map"

const fetchAPI = fetchRetry(fetch)

const POLYANETS_API_URL = "https://challenge.crossmint.io/api/polyanets"
const SOLOONS_API_URL = "https://challenge.crossmint.io/api/soloons"
const COMETHS_API_URL = "https://challenge.crossmint.io/api/comeths"

/** Maps goal Megaverse values with their necessary params and url. */
const REQUEST_PARAMS_BY_MAP_VALUE: {
  [key: string]: {
    url: string
    body: Object
  }
} = {
  POLYANET: {
    url: POLYANETS_API_URL,
    body: {},
  },
  RIGHT_COMETH: {
    url: COMETHS_API_URL,
    body: {
      direction: "right",
    },
  },
  UP_COMETH: {
    url: COMETHS_API_URL,
    body: {
      direction: "up",
    },
  },
  LEFT_COMETH: {
    url: COMETHS_API_URL,
    body: {
      direction: "left",
    },
  },
  DOWN_COMETH: {
    url: COMETHS_API_URL,
    body: {
      direction: "down",
    },
  },
  BLUE_SOLOON: {
    url: SOLOONS_API_URL,
    body: {
      color: "blue",
    },
  },
  RED_SOLOON: {
    url: SOLOONS_API_URL,
    body: {
      color: "red",
    },
  },
  WHITE_SOLOON: {
    url: SOLOONS_API_URL,
    body: {
      color: "white",
    },
  },
  PURPLE_SOLOON: {
    url: SOLOONS_API_URL,
    body: {
      color: "purple",
    },
  },
  /** Space doesn't have a fixed URL because it is about deleting an item. */
  SPACE: {
    url: "",
    body: {},
  },
}

/** API handler to upgrade the candidate Megaverse map */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const {
    valuesToChange,
    candidateId,
  }: {
    valuesToChange: ValuesToChange
    candidateId: string
  } = req.body

  try {
    const headers = new Headers()
    headers.append("Content-Type", "application/json")

    console.time("Upgrading map")

    /** Map all changes, and send one request at a time to guarantee it goes through  */
    for (let index = 0; index < valuesToChange.length; index++) {
      const { column, currentValue, goalValue, row } = valuesToChange[index]

      /** Find the API URL and additional body arguments from the goal map value.  */
      let { body: additionalBody, url } = REQUEST_PARAMS_BY_MAP_VALUE[goalValue]

      const body: {
        row: number
        column: number
        candidateId: string
        color?: string
        direction?: string
      } = {
        row: row,
        column: column,
        candidateId,
        ...additionalBody,
      }

      let method = "POST"

      /** The "SPACE" url is determined by the current value, because we will DELETE the current item. */
      if (goalValue === "SPACE") {
        method = "DELETE"
        url = REQUEST_PARAMS_BY_MAP_VALUE[currentValue].url
      }

      console.log(`Request ${index + 1} of ${valuesToChange.length}`)
      /**
       * The map API only accepts 10 requests per 10 seconds, and it has a backoff, so we have to keep retrying.
       */
      await fetchAPI(url, {
        method,
        body: JSON.stringify(body),
        headers,
        retries: 10,
        retryDelay: function (attempt) {
          return Math.pow(2, attempt) * 1000 // 1000, 2000, 4000
        },
        retryOn: function (attempt, error, response) {
          // retry on any network error, or 4xx or 5xx status codes
          if (error !== null || (response?.status && response?.status >= 400)) {
            console.log(`Retrying, attempt number ${attempt + 1}`)
            return true
          }

          return false
        },
      })
    }

    console.timeEnd("Upgrading map")

    res.status(200).json({})
  } catch (e) {
    console.log(e)

    res.status(500).json(e + "")
  }
}
