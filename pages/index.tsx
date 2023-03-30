import Head from "next/head"
import { Button, Flex, Heading, Input, Text } from "theme-ui"
import { FormEvent } from "react"
import { Tab, Tabs, TabList, TabPanel } from "react-tabs"
import "react-tabs/style/react-tabs.css"

import { Megaverse } from "@/components/Megaverse"
import useMegaverses from "@/hooks/useMegaverses"

export default function Home() {
  const {
    candidateMap,
    feedbackMessage,
    goalMap,
    isLoadingMegaverses,
    isResetting,
    isUpgrading,
    valuesToChangeCount,
    resetMegaverse,
    setCandidateId,
    fetchMegaverses,
    upgradeMegaverse,
  } = useMegaverses()

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const candidateId = new FormData(e.currentTarget).get("candidate_id")

    try {
      if (!candidateId) throw new Error("Empty id")

      setCandidateId(candidateId.toString())

      await fetchMegaverses({ candidateId: candidateId.toString() })
    } catch (e) {
      console.log(e)
    }
  }

  const handleUpgradeMegaverseButtonClick = async () => {
    try {
      await upgradeMegaverse()
    } catch (e) {
      console.log(e)
    }
  }

  const handleResetMegaverseButtonClick = async () => {
    try {
      await resetMegaverse()
    } catch (e) {
      console.log(e)
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
            We&apos;ll fetch your Megaverse and you can make some changes to it
            in a single click 💪
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

          <Button disabled={isLoadingMegaverses}>
            {isLoadingMegaverses ? "Loading..." : "Load Megaverses"}
          </Button>
        </form>

        <Text>{feedbackMessage}&nbsp;</Text>

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
                    </Text>
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
