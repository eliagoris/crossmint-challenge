import Head from "next/head"
import { Button, Flex, Heading, Input, Text } from "theme-ui"
import { FormEvent, useState } from "react"
import { getMaps } from "@/services/map"

export default function Home() {
  const [isFormLoading, setIsFormLoading] = useState(false)
  const [formMessage, setFormMessage] = useState(" ")
  const [candidateMap, setCandidateMap] = useState<string[][]>()

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setIsFormLoading(true)

    const candidateId = new FormData(e.currentTarget).get("candidate_id")

    try {
      if (!candidateId) throw new Error("Empty id")

      const { candidateMap, goalMap } = await getMaps({
        candidateId: candidateId.toString(),
      })

      setCandidateMap(candidateMap)
      console.log(candidateMap)
      setIsFormLoading(false)
      setFormMessage("Success!")
    } catch (e) {
      console.log(e)
      setFormMessage(e + "")
    } finally {
      setIsFormLoading(false)
    }
  }
  return (
    <>
      <Head>
        <title>Crossmint Challenge</title>
        <meta name="description" content="Get your megaverse validated!" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minHeight: "100vh",
          padding: "48px 0",
          gap: "32px",
        }}
      >
        <Flex
          sx={{
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <Heading>Have your cool Megaverse validated!</Heading>
          <Text
            sx={{
              maxWidth: "420px",
            }}
          >
            We&apos;ll fetch your map and you can make the necessary changes in
            a single click 🎉
          </Text>
        </Flex>

        <form
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
          onSubmit={handleFormSubmit}
        >
          <label
            htmlFor="candidate_id"
            sx={{
              fontSize: "12px",
            }}
          >
            Candidate ID
          </label>
          <Input
            id="candidate_id"
            name="candidate_id"
            placeholder="Enter your candidate ID"
            title="Candidate ID"
            defaultValue="4af401b6-4a32-4f7a-a8fe-d67730166c4a"
            required
          />

          <Button disabled={isFormLoading}>
            {isFormLoading ? "Loading..." : "Load map"}
          </Button>
          {formMessage}
        </form>

        <Flex
          sx={{
            flexDirection: "column",
            letterSpacing: "1em",
            span: {
              width: "32px",
              height: "19px",
            },
          }}
        >
          {candidateMap &&
            candidateMap.map((row) => {
              return (
                <Flex sx={{}}>
                  {row.map((value) => {
                    if (!value || value === "SPACE") return <span>🌌</span>

                    if (value === "POLYANET") return <span>🪐</span>

                    if (value === "RIGHT_COMETH")
                      return (
                        <span
                          sx={{
                            position: "relative",
                            rotate: "140deg",
                            top: ".25rem",
                            right: ".75rem",
                          }}
                        >
                          ☄️
                        </span>
                      )

                    if (value === "UP_COMETH")
                      return (
                        <span
                          sx={{
                            position: "relative",
                            rotate: "48deg",
                            top: ".5rem",
                            right: ".25rem",
                          }}
                        >
                          ☄️
                        </span>
                      )

                    if (value === "LEFT_COMETH")
                      return (
                        <span
                          sx={{
                            position: "relative",
                            rotate: "330deg",
                            bottom: ".25rem",
                            left: ".25rem",
                          }}
                        >
                          ☄️
                        </span>
                      )

                    if (value === "DOWN_COMETH")
                      return (
                        <span
                          sx={{
                            position: "relative",
                            rotate: "230deg",
                            right: ".75rem",
                            bottom: ".5rem",
                          }}
                        >
                          ☄️
                        </span>
                      )

                    if (value === "BLUE_SOLOON")
                      return (
                        <span
                          sx={{
                            filter:
                              "grayscale(100%) brightness(30%) sepia(100%) hue-rotate(-180deg) saturate(700%) contrast(0.8)",
                          }}
                        >
                          🌕
                        </span>
                      )

                    if (value === "RED_SOLOON")
                      return (
                        <span
                          sx={{
                            filter:
                              "grayscale(100%) brightness(40%) sepia(100%) hue-rotate(-50deg) saturate(600%) contrast(0.8)",
                          }}
                        >
                          🌕
                        </span>
                      )

                    if (value === "WHITE_SOLOON")
                      return (
                        <span
                          sx={{
                            filter: "grayscale(100%)",
                          }}
                        >
                          🌕
                        </span>
                      )

                    if (value === "PURPLE_SOLOON")
                      return (
                        <span
                          sx={{
                            filter:
                              "grayscale(100%) brightness(70%) sepia(50%) hue-rotate(-100deg) saturate(500%) contrast(1)",
                          }}
                        >
                          🌕
                        </span>
                      )
                  })}
                </Flex>
              )
            })}
        </Flex>
      </main>
    </>
  )
}
