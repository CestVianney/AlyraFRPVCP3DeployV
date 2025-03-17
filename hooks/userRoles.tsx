import { useAccount } from 'wagmi'
import { useEffect, useState } from 'react'
import { useReadContract } from 'wagmi'
import { parseAbiItem } from 'viem'
import { publicClient } from '@/utils/publicClient'
import { VOTING_CONTRACT_ADDRESS, VOTING_CONTRACT_ABI } from '@/constants/votingContract'

export enum UserRoleEnum {
  OWNER = 'OWNER',
  VOTER = 'VOTER',
}

export const UserRoleText: Record<UserRoleEnum, string> = {
    [UserRoleEnum.VOTER]: "Votant",
    [UserRoleEnum.OWNER]: "Propriétaire du contrat",
  };

export function useRoles() {
  const { address, isConnected } = useAccount()
  const [roles, setRoles] = useState<UserRoleEnum[]>([])

  const { data: ownerAddress } = useReadContract({
    abi: VOTING_CONTRACT_ABI,
    address: VOTING_CONTRACT_ADDRESS,
    functionName: 'owner',
  }) as { data: string | undefined }

  useEffect(() => {
    async function fetchRoles() {
      const currentRoles: UserRoleEnum[] = []

      if (isConnected && address) {
        // Vérifier si l'utilisateur est owner
        if (ownerAddress?.toLowerCase() === address.toLowerCase()) {
          currentRoles.push(UserRoleEnum.OWNER)
        }

        // Vérifier si l'utilisateur est votant (via événements passés)
        const votersRegisteredLogs =  await publicClient.getLogs({
            address: VOTING_CONTRACT_ADDRESS,
            event: parseAbiItem('event VoterRegistered(address voterAddress)'),
            fromBlock: BigInt(0),
            toBlock: 'latest'
            })

        const registeredVoters = votersRegisteredLogs?.map(log => log.args.voterAddress?.toLowerCase())

        if (registeredVoters?.includes(address.toLowerCase())) {
          currentRoles.push(UserRoleEnum.VOTER)
        }
      }

      setRoles(currentRoles)
    }

    fetchRoles()
  }, [address, isConnected, ownerAddress, publicClient])

  return roles
}
