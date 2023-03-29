import Head from "next/head"
import { Button, Flex, Heading, Input, Text } from "theme-ui"
import { FormEvent, useState } from "react"
import { Tab, Tabs, TabList, TabPanel } from "react-tabs"
import "react-tabs/style/react-tabs.css"

import { CandidateMapContent, getMaps } from "@/services/map"
import { Megaverse } from "@/components/Megaverse"

export default function Home() {
  const [isFormLoading, setIsFormLoading] = useState(false)
  const [formMessage, setFormMessage] = useState(" ")
  const [candidateMap, setCandidateMap] = useState<CandidateMapContent | null>(
    null
  )
  const [goalMap, setGoalMap] = useState<string[][] | null>(null)
  const [valuesToChange, setValuesToChange] = useState<number | null>(null)

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setIsFormLoading(true)

    const candidateId = new FormData(e.currentTarget).get("candidate_id")

    try {
      if (!candidateId) throw new Error("Empty id")

      const { candidateMap, goalMap } = await getMaps({
        candidateId: candidateId.toString(),
      })

      // const { validMap, valuesToChange } = getUpdatedMap({
      //   candidateMap,
      //   goalMap,
      // })

      setValuesToChange(122)
      setCandidateMap(candidateMap)
      setGoalMap(goalMap)
      console.log(candidateMap)
      setIsFormLoading(false)
      setFormMessage("Megaverses loaded!")
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
            We&apos;ll fetch your Megaverse and you can make the necessary
            changes in a single click 🎉
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
            {isFormLoading ? "Loading..." : "Load Megaverses"}
          </Button>
          {formMessage}
        </form>

        {candidateMap && goalMap ? (
          <Tabs
            sx={{
              minWidth: "960px",
            }}
          >
            <TabList>
              <Tab>My Megaverse</Tab>
              <Tab>Goal Megaverse</Tab>
            </TabList>

            <TabPanel>
              <>
                <Flex
                  sx={{
                    alignItems: "center",
                    marginBottom: "16px",
                    justifyContent: "space-between",
                    minHeight: "36px",
                  }}
                >
                  <Text
                    sx={{
                      fontSize: "14px",
                    }}
                  >
                    This is your Megaverse. <br />
                    It needs <b>{valuesToChange} changes</b> to be valid. Click
                    the button to upgrade:
                  </Text>
                  <Button variant="special">
                    <span>Upgrade my Megaverse</span>
                  </Button>
                </Flex>
                <Megaverse type="CANDIDATE" map={candidateMap} />
              </>
            </TabPanel>
            <TabPanel>
              <Flex
                sx={{
                  alignItems: "center",
                  marginBottom: "16px",
                  justifyContent: "space-between",
                  minHeight: "36px",
                }}
              >
                <Text
                  sx={{
                    fontSize: "14px",
                  }}
                >
                  This is what your Megaverse should look like 🤯😮
                </Text>
              </Flex>
              <Megaverse type="GOAL" map={goalMap} />
            </TabPanel>
          </Tabs>
        ) : null}
      </main>
    </>
  )
}
