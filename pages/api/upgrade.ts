import type { NextApiRequest, NextApiResponse } from "next"
import fetchRetry from "fetch-retry"

import { ValuesToChange } from "@/services/map"

const fetchAPI = fetchRetry(fetch)

const POLYANETS_API_URL = "https://challenge.crossmint.io/api/polyanets"
const SOLOONS_API_URL = "https://challenge.crossmint.io/api/soloons"
const COMETHS_API_URL = "https://challenge.crossmint.io/api/comeths"

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

    const promises = valuesToChange.map(
      ({ column, currentValue, goalValue, row }) => {
        /** Find the API URL and additional body arguments from the goal map value.  */
        let { body: additionalBody, url } =
          REQUEST_PARAMS_BY_MAP_VALUE[goalValue]

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

        /** The "SPACE" url is determined by the current value, because we will DELETE the item. */
        if (goalValue === "SPACE") {
          method = "DELETE"
          url = REQUEST_PARAMS_BY_MAP_VALUE[currentValue].url
        }

        /**
         * The map API only accepts 10 requests per 10 seconds, so we have to keep retrying.
         */
        return fetchAPI(url, {
          method,
          body: JSON.stringify(body),
          headers,
          retries: 20,
          retryDelay: 10000,
          retryOn: [429],
        })
      }
    )

    console.time("Upgrading map")
    await Promise.all(promises)
    console.timeEnd("Upgrading map")

    res.status(200).json({})
  } catch (e) {
    console.log(e)

    res.status(500).json(e + "")
  }
}
