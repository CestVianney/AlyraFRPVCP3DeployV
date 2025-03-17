import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { VOTING_CONTRACT_ABI, VOTING_CONTRACT_ADDRESS } from "@/constants/votingContract"
import TitleDivider from "@/components/TitleDivider"
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { Spinner } from "@/components/ui/loadingspinner"
import useRefreshData from "@/hooks/useRefreshData"

interface VoteProposalProps {
  workflowStatus: any;
}

const VoteProposal = ({ workflowStatus }: VoteProposalProps) => {
  const [proposalId, setProposalId] = useState("")
  const { writeContract } = useWriteContract()
  const { isLoading: isConfirming } = useWaitForTransactionReceipt()
  const refreshData = useRefreshData()

  const handleVote = async () => {
    if (!proposalId) return
    const tx = await writeContract({
      abi: VOTING_CONTRACT_ABI,
      address: VOTING_CONTRACT_ADDRESS,
      functionName: "setVote",
      args: [parseInt(proposalId)],
    })

    setProposalId("")
    refreshData()
  }

  const getTooltipMessage = () => {
    if (workflowStatus < 3) return "La session de vote n'a pas encore commencé."
    if (workflowStatus > 3) return "La session de vote est terminée."
    return ""
  }

  return (
    <>
      <TitleDivider title="Voter pour une proposition" />
      <div className="flex items-center justify-center gap-2">
        <Input
          type="number"
          placeholder="ID de la proposition"
          value={proposalId}
          onChange={(e) => setProposalId(e.target.value)}
        />
        <TooltipProvider>
          {workflowStatus !== 3 ? (
            <Tooltip>
              <TooltipTrigger>
                <Button
                  className="bg-green-500 hover:bg-green-400"
                  onClick={handleVote}
                  disabled={workflowStatus !== 3}
                >
                  Voter
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {getTooltipMessage()}
              </TooltipContent>
            </Tooltip>
          ) : (
            isConfirming ?
              <Spinner /> :
              (<Button
                className="bg-green-500 hover:bg-green-400"
                onClick={handleVote}
                disabled={workflowStatus !== 3}
              >
                Voter
              </Button>)
          )}
        </TooltipProvider>
      </div>
    </>
  )
}

export default VoteProposal