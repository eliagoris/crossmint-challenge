import Head from "next/head"
import { Button, Flex, Heading, Input, Text } from "theme-ui"
import { FormEvent, useState } from "react"

export default function Home() {
  const [isFormLoading, setIsFormLoading] = useState(false)
  const [formMessage, setFormMessage] = useState(" ")

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setIsFormLoading(true)

    const candidateId = new FormData(e.currentTarget).get("candidate_id")

    console.log(candidateId)

    setIsFormLoading(false)
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

          <Button>Load map</Button>
          {isFormLoading ? "Loading..." : formMessage}
        </form>
      </main>
    </>
  )
}
