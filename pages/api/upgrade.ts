import type { NextApiRequest, NextApiResponse } from "next"

const POLYANETS_API_BASE_URL = "https://challenge.crossmint.io/api/polyanets"

type Data = {
  name: string
}

/** API handler to upgrade the candidate Megaverse map */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const {
    polyanetsToCreate,
  }: {
    polyanetsToCreate: {
      rowIndex: number
      columnIndex: number
    }[]
  } = req.body

  try {
    var headers = new Headers()
    headers.append("Content-Type", "application/json")

    const promises = polyanetsToCreate.map((toCreate) => {
      const body = JSON.stringify({
        row: toCreate.rowIndex,
        column: toCreate.columnIndex,
        candidateId: "4af401b6-4a32-4f7a-a8fe-d67730166c4a",
      })

      return fetch(POLYANETS_API_BASE_URL, {
        method: "POST",
        body,
        headers,
      })
    })

    const result = await Promise.all(promises)

    console.log(result)

    res.status(200).json(result)
  } catch (e) {
    console.log(e)

    res.status(500).json(e + "")
  }
}
