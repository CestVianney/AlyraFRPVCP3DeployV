import { VOTING_CONTRACT_ADDRESS, VOTING_CONTRACT_ABI } from "@/constants/votingContract"
import { publicClient } from "@/utils/publicClient"
import { useEffect, useState } from "react"
import { parseAbiItem } from "viem"
import { useWatchContractEvent } from 'wagmi'

export interface Vote {
  voter: string
  proposalId: bigint
}

export const useEventsData = () => {
  const [voters, setVoters] = useState<string[]>([])
  const [proposals, setProposals] = useState<bigint[]>([])
  const [votes, setVotes] = useState<Vote[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Récupération des données initiales
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true)
      await Promise.all([
        handleVotersLogs(),
        handleProposalsLogs(),
        handleVotesLogs()
      ])
      setIsLoading(false)
    }
    
    fetchInitialData()
  }, [])

  const handleVotersLogs = async () => {
    const votersLogs = await publicClient.getLogs({
      address: VOTING_CONTRACT_ADDRESS,
      event: parseAbiItem("event VoterRegistered(address voterAddress)"),
      fromBlock: BigInt(7922600),
      toBlock: "latest"
    })

    votersLogs.map((log) => {
      const voterAddress = log.args.voterAddress as string
      setVoters(prev => {
        if (!prev.includes(voterAddress)) {
          return [...prev, voterAddress]
        }
        return prev
      })
    })
  }

  const handleProposalsLogs = async () => {
    const proposalsLogs = await publicClient.getLogs({
      address: VOTING_CONTRACT_ADDRESS,
      event: parseAbiItem("event ProposalRegistered(uint proposalId)"),
      fromBlock: BigInt(7922600),
      toBlock: "latest"
    })

    proposalsLogs.map((log) => {
      const proposalId = log.args.proposalId as bigint
      setProposals(prev => {
        if (!prev.includes(proposalId)) {
          return [...prev, proposalId]
        }
        return prev
      })
    })
  }

  const handleVotesLogs = async () => {
    const votesLogs = await publicClient.getLogs({
      address: VOTING_CONTRACT_ADDRESS,
      event: parseAbiItem("event Voted(address voter, uint proposalId)"),
      fromBlock: BigInt(7922600),
      toBlock: "latest"
    })

    votesLogs.map((log) => {
      const voter = log.args.voter as string
      const proposalId = log.args.proposalId as bigint
      setVotes(prevVotes => {
        if (!prevVotes.find(vote => vote.voter === voter && vote.proposalId === proposalId)) {
          return [...prevVotes, { voter, proposalId }]
        }
        return prevVotes
      })
    })
  }

  // Surveillance des événements en temps réel
  useWatchContractEvent({
    address: VOTING_CONTRACT_ADDRESS,
    abi: VOTING_CONTRACT_ABI,
    eventName: "VoterRegistered",
    onLogs: (logs: any[]) => {
      logs.map((log) => {
        const voterAddress = log.args.voterAddress as string
        setVoters(prevVoters => {
          if (!prevVoters.includes(voterAddress)) {
            return [...prevVoters, voterAddress]
          }
          return prevVoters
        })
      })
    }
  })

  useWatchContractEvent({
    address: VOTING_CONTRACT_ADDRESS,
    abi: VOTING_CONTRACT_ABI,
    eventName: "ProposalRegistered",
    onLogs: (logs: any[]) => {
      logs.map((log) => {
        const proposalId = log.args.proposalId as bigint
        setProposals(prevProposals => {
          if (!prevProposals.includes(proposalId)) {
            return [...prevProposals, proposalId]
          }
          return prevProposals
        })
      })
    }
  })

  useWatchContractEvent({
    address: VOTING_CONTRACT_ADDRESS,
    abi: VOTING_CONTRACT_ABI,
    eventName: "Voted",
    onLogs: (logs: any[]) => {
      logs.map((log) => {
        const voter = log.args.voter as string
        const proposalId = log.args.proposalId as bigint
        setVotes(prevVotes => {
          if (!prevVotes.find(vote => vote.voter === voter && vote.proposalId === proposalId)) {
            return [...prevVotes, { voter, proposalId }]
          }
          return prevVotes
        })
      })
    }
  })

  return { voters, proposals, votes, isLoading }
} 