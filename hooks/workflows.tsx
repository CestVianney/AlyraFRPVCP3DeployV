import { useEffect, useState } from 'react'
import { parseAbiItem } from 'viem'
import { useWatchContractEvent } from 'wagmi'
import { publicClient } from '@/utils/publicClient'
import { VOTING_CONTRACT_ABI, VOTING_CONTRACT_ADDRESS } from '@/constants/votingContract'

export enum WorkflowStatus {
    RegisteringVoters = 0,
    ProposalsRegistrationStarted = 1,
    ProposalsRegistrationEnded = 2,
    VotingSessionStarted = 3,
    VotingSessionEnded = 4,
    VotesTallied = 5,
}

export const WorkflowStatusText: Record<WorkflowStatus, string> = {
    [WorkflowStatus.RegisteringVoters]: 'Enregistrement des votants',
    [WorkflowStatus.ProposalsRegistrationStarted]: 'Enregistrement des propositions',
    [WorkflowStatus.ProposalsRegistrationEnded]: 'Fin de l\'enregistrement des propositions',
    [WorkflowStatus.VotingSessionStarted]: 'Début de la session de vote',
    [WorkflowStatus.VotingSessionEnded]: 'Fin de la session de vote',
    [WorkflowStatus.VotesTallied]: 'Scores des votes',
}

export function useWorkflowStatus() {
    const [workflowStatus, setWorkflowStatus] = useState<WorkflowStatus>(WorkflowStatus.RegisteringVoters)
  
    // Chargement initial du workflow status
    useEffect(() => {
      async function fetchInitialWorkflowStatus() {
        const status = await publicClient.getLogs({
          address: VOTING_CONTRACT_ADDRESS,
          event: parseAbiItem('event WorkflowStatusChange(uint8 previousStatus, uint8 newStatus)'),
          fromBlock: BigInt(0),
          toBlock: 'latest'
        })
        const latestEvent = status[status.length - 1]
        if (!latestEvent) { return }

        setWorkflowStatus(latestEvent?.args.newStatus as WorkflowStatus)
      }
  
      fetchInitialWorkflowStatus()
    }, [])
  
    // Écoute des événements WorkflowStatusChange
    useWatchContractEvent({
      address: VOTING_CONTRACT_ADDRESS,
      abi: VOTING_CONTRACT_ABI,
      eventName: 'WorkflowStatusChange',
      onLogs(logs: any[]) {
        const latestEvent = logs[logs.length - 1]
        setWorkflowStatus(latestEvent?.args.newStatus as WorkflowStatus)
      },
    })
  
    return workflowStatus
  }