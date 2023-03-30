import { useState } from "react"

import {
  CandidateMapContent,
  getMaps,
  getValuesToChange,
  getValuesToChangeToReset,
  resetMap,
  upgradeMap,
} from "@/services/map"

/**
 * Hook that contains state and handlers to work with the candidate and the goal Megaverses.
 */
export default function useMegaverses() {
  const [isLoadingMegaverses, setIsLoadingMegaverses] = useState(false)
  const [candidateMap, setCandidateMap] = useState<CandidateMapContent | null>(
    null
  )
  const [candidateId, setCandidateId] = useState<string | null>(null)
  const [goalMap, setGoalMap] = useState<string[][] | null>(null)
  const [valuesToChangeCount, setValuesToChangeCount] = useState<number | null>(
    null
  )
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null)
  const [isUpgrading, setIsUpgrading] = useState(false)
  const [isResetting, setIsResetting] = useState(false)

  const fetchMegaverses = async ({ candidateId }: { candidateId: string }) => {
    try {
      setFeedbackMessage("Loading your Megaverses...")

      setIsLoadingMegaverses(true)

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

      setFeedbackMessage("Megaverses loaded!")
    } catch (e) {
      console.log(e)
      setFeedbackMessage(e + "")
    } finally {
      setIsLoadingMegaverses(false)
      setTimeout(() => {
        setFeedbackMessage("")
      }, 6000)
    }
  }

  const upgradeMegaverse = async () => {
    try {
      if (!candidateMap || !goalMap || !candidateId) {
        setFeedbackMessage("Something went wrong. Couldn't load maps.")
        return null
      }

      setFeedbackMessage(
        `Changing ${valuesToChangeCount} items in your Megaverse... This may take a while.`
      )

      setIsUpgrading(true)
      await upgradeMap({ candidateMap, goalMap, candidateId })

      setFeedbackMessage("Your Megaverse has been upgraded! 🎉")

      await fetchMegaverses({ candidateId })
    } catch (e) {
      console.log(e)
      setFeedbackMessage(e + "")
      setIsUpgrading(false)
    } finally {
      setIsUpgrading(false)
      setTimeout(() => {
        setFeedbackMessage("")
      }, 6000)
    }
  }

  const resetMegaverse = async () => {
    if (!candidateMap || !goalMap || !candidateId) {
      setFeedbackMessage("Something went wrong. Couldn't load maps.")
      return null
    }

    try {
      const itemsToReset = getValuesToChangeToReset({ candidateMap })
      setFeedbackMessage(
        `Resetting ${itemsToReset.length} items from your Megaverse... This may take a while.`
      )

      setIsResetting(true)
      await resetMap({ candidateMap, candidateId })

      setFeedbackMessage("Your Megaverse has been resetted!")

      await fetchMegaverses({ candidateId })
    } catch (e) {
      console.log(e)
      setFeedbackMessage(e + "")
      setIsResetting(false)
    } finally {
      setIsResetting(false)
      setTimeout(() => {
        setFeedbackMessage("")
      }, 6000)
    }
  }

  return {
    isLoadingMegaverses,
    isUpgrading,
    isResetting,
    valuesToChangeCount,
    candidateMap,
    candidateId,
    goalMap,
    feedbackMessage,
    fetchMegaverses,
    setCandidateId,
    setFeedbackMessage,
    upgradeMegaverse,
    resetMegaverse,
  }
}
