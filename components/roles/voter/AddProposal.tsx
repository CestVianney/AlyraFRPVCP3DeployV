import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { VOTING_CONTRACT_ABI, VOTING_CONTRACT_ADDRESS } from "@/constants/votingContract"
import TitleDivider from "@/components/TitleDivider"
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { Spinner } from "@/components/ui/loadingspinner"

interface AddProposalProps {
  workflowStatus: any; // Replace 'any' with the appropriate type if known
}

const AddProposal = ({ workflowStatus }: AddProposalProps) => {
  const [proposalDesc, setProposalDesc] = useState("")
  const { writeContract } = useWriteContract()
  const { isLoading: isConfirming } = useWaitForTransactionReceipt()

  const handleAddProposal = async () => {
    if (!proposalDesc) return

    try {
      const tx = await writeContract({
        abi: VOTING_CONTRACT_ABI,
        address: VOTING_CONTRACT_ADDRESS,
        functionName: "addProposal",
        args: [proposalDesc]
      })
    } catch (error) {
      console.error("Failed to add proposal:", error)
    }

    setProposalDesc("")
  }

  const getTooltipMessage = () => {
    if (workflowStatus < 1) return "La session d'enregistrement des propositions n'a pas encore commencé."
    if (workflowStatus > 1) return "La session d'enregistrement des propositions est terminée."
    return ""
  }

  return (
    <>
      <TitleDivider title="Ajouter une proposition" />
      <div className="flex items-center justify-center gap-2">
        <Input
          type="text"
          placeholder="Description de la proposition"
          value={proposalDesc}
          onChange={(e) => setProposalDesc(e.target.value)}
        />
        <TooltipProvider>
          {workflowStatus !== 1 ? (
            <Tooltip>
              <TooltipTrigger>
                <Button
                  className="bg-green-500 hover:bg-green-400"
                  onClick={handleAddProposal}
                  disabled={workflowStatus !== 1}
                >
                  Ajouter
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {getTooltipMessage()}
              </TooltipContent>
            </Tooltip>
          ) : (
            isConfirming ?
              (<Spinner />) :
              (
                <Button
                  className="bg-green-500 hover:bg-green-400"
                  onClick={handleAddProposal}
                  disabled={workflowStatus !== 1}
                >
                  Ajouter
                </Button>
              )
          )}
        </TooltipProvider>
      </div>
    </>
  )
}

export default AddProposal