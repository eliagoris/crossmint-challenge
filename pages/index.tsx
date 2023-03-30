import Head from "next/head"
import { Button, Flex, Heading, Input, Text } from "theme-ui"
import { FormEvent, useState } from "react"
import { Tab, Tabs, TabList, TabPanel } from "react-tabs"
import "react-tabs/style/react-tabs.css"

import {
  CandidateMapContent,
  getMaps,
  getValuesToChange,
  getValuesToChangeByReset,
  resetMap,
  upgradeMap,
} from "@/services/map"
import { Megaverse } from "@/components/Megaverse"

export default function Home() {
  const [isFormLoading, setIsFormLoading] = useState(false)
  const [formMessage, setFormMessage] = useState(" ")
  const [candidateMap, setCandidateMap] = useState<CandidateMapContent | null>(
    null
  )
  const [candidateId, setCandidateId] = useState<string | null>(null)
  const [goalMap, setGoalMap] = useState<string[][] | null>(null)
  const [valuesToChangeCount, setValuesToChangeCount] = useState<number | null>(
    null
  )
  const [isUpgrading, setIsUpgrading] = useState(false)
  const [isResetting, setIsResetting] = useState(false)

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setIsFormLoading(true)

    const candidateId = new FormData(e.currentTarget).get("candidate_id")

    try {
      if (!candidateId) throw new Error("Empty id")

      setFormMessage("Loading Megaverses...")
      setCandidateId(candidateId.toString())

      const { candidateMap, goalMap } = await getMaps({
        candidateId: candidateId.toString(),
      })

      const { valuesToChangeCount } = getValuesToChange({
        candidateMap,
        goalMap,
      })

      setValuesToChangeCount(valuesToChangeCount)
      setCandidateMap(candidateMap)
      setGoalMap(goalMap)

      setIsFormLoading(false)
      setFormMessage("Megaverses loaded!")
    } catch (e) {
      console.log(e)
      setFormMessage(e + "")
    } finally {
      setIsFormLoading(false)
    }
  }

  const handleUpgradeMegaverseButtonClick = async () => {
    if (!candidateMap || !goalMap || !candidateId) {
      setFormMessage("Something went wrong. Couldn't load maps.")
      return null
    }

    try {
      setFormMessage(`Changing ${valuesToChangeCount} in your Megaverse...`)

      setIsUpgrading(true)
      await upgradeMap({ candidateMap, goalMap, candidateId })

      setFormMessage("Megaverse upgraded!")
    } catch (e) {
      console.log(e)
      setFormMessage(e + "")
      setIsUpgrading(false)
    } finally {
      setIsUpgrading(false)
    }
  }

  const handleResetMegaverseButtonClick = async () => {
    if (!candidateMap || !goalMap || !candidateId) {
      setFormMessage("Something went wrong. Couldn't load maps.")
      return null
    }

    try {
      const itemsToReset = getValuesToChangeByReset({ candidateMap })
      setFormMessage(
        `Resetting ${itemsToReset.length} items from your Megaverse... This may take a while.`
      )

      setIsResetting(true)
      await resetMap({ candidateMap, candidateId })

      setFormMessage("Megaverse resetted!")
    } catch (e) {
      console.log(e)
      setFormMessage(e + "")
      setIsResetting(false)
    } finally {
      setIsResetting(false)
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
            minWidth: "320px",
            alignItems: "center",
            gap: "8px",
          }}
          onSubmit={handleFormSubmit}
        >
          <label
            htmlFor="candidate_id"
            sx={{
              alignSelf: "flex-start",
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
        </form>

        <Text>{formMessage}</Text>

        {candidateMap && goalMap ? (
          <Tabs
            sx={{
              "@media (min-width: 1024px)": {
                minWidth: "960px",
              },
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
                      fontSize: "12px",
                    }}
                  >
                    <Text
                      sx={{
                        fontSize: "14px",
                      }}
                    >
                      This is your Megaverse right now.
                    </Text>{" "}
                    <br />
                    {valuesToChangeCount !== null ? (
                      valuesToChangeCount > 0 ? (
                        <>
                          It needs <b>{valuesToChangeCount} changes</b> to be
                          valid. Click the button to upgrade:
                        </>
                      ) : (
                        "Your Megaverse is completely valid. Congratulations! 🎉"
                      )
                    ) : null}
                  </Text>
                  <Flex
                    sx={{
                      gap: "16px",
                    }}
                  >
                    <Button
                      disabled={isResetting}
                      onClick={handleResetMegaverseButtonClick}
                    >
                      <span>
                        {isResetting ? "Resetting..." : "Reset my Megaverse"}
                      </span>
                    </Button>
                    <Button
                      disabled={isUpgrading || valuesToChangeCount === 0}
                      onClick={handleUpgradeMegaverseButtonClick}
                      variant="special"
                    >
                      <span>
                        {isUpgrading ? "Upgrading..." : "Upgrade my Megaverse"}
                      </span>
                    </Button>
                  </Flex>
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
