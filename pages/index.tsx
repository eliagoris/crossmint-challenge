import Head from "next/head"
import { Inter } from "next/font/google"
import { Button, Flex, Heading, Input, Text } from "theme-ui"

const inter = Inter({ subsets: ["latin"] })

export default function Home() {
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
          <Heading>Validate your cool Megaverse!</Heading>
          <Text>
            You&apos;ll only need your candidate ID to play with your map
          </Text>
        </Flex>

        <Flex
          as="form"
          sx={{
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <label>
            <Input
              placeholder="candidate id"
              defaultValue="4af401b6-4a32-4f7a-a8fe-d67730166c4a"
            />
          </label>

          <Button>Load map</Button>
        </Flex>
      </main>
    </>
  )
}
