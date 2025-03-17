import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useWaitForTransactionReceipt } from "wagmi"

import { useWriteContract } from 'wagmi'
import { useWorkflowStatus, WorkflowStatusText, WorkflowStatus } from "@/hooks/workflows"
import { VOTING_CONTRACT_ADDRESS, VOTING_CONTRACT_ABI } from "@/constants/votingContract"
import TitleDivider from "@/components/TitleDivider"
import { Spinner } from "@/components/ui/loadingspinner"

const WorkflowManager = () => {
  const workflowStatus = useWorkflowStatus()
  const { writeContract } = useWriteContract()
  const { isLoading: isConfirming } = useWaitForTransactionReceipt();

  const handleWorkflowStatusChange = async (currentStatus: WorkflowStatus) => {
    const functionMap: Record<number, string> = {
      [WorkflowStatus.RegisteringVoters]: 'startProposalsRegistering',
      [WorkflowStatus.ProposalsRegistrationStarted]: 'endProposalsRegistering',
      [WorkflowStatus.ProposalsRegistrationEnded]: 'startVotingSession',
      [WorkflowStatus.VotingSessionStarted]: 'endVotingSession',
      [WorkflowStatus.VotingSessionEnded]: 'tallyVotes'
    }

    const functionName = functionMap[currentStatus]
    
    if (!functionName) {
      console.error("Aucune action possible à partir du statut actuel")
      return
    }
    
    writeContract({
      abi: VOTING_CONTRACT_ABI,
      address: VOTING_CONTRACT_ADDRESS,
      functionName,
    })
  }

  return (
    <>
      <TitleDivider title="Changer le statut du workflow" />
      <div className="flex flex-col items-center px-4 w-full">
        <div className="flex items-end justify-end">
          <div className="flex flex-col items-center justify-center px-4">
            <div className="flex flex-col items-center justify-center gap-2">
              <p className="text-sm font-bold">Workflow status actuel :</p>
              <Badge className="px-4 py-2 bg-blue-500 hover:bg-blue-500 hover:text-white">
                {WorkflowStatusText[workflowStatus]}
              </Badge>
            </div>
          </div>

          {workflowStatus !== WorkflowStatus.VotesTallied && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="bg-gray-500 hover:bg-gray-600" size="icon">
                  {isConfirming ? <Spinner /> : <ChevronRight />}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Changer le statut du workflow ?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Cette action ne peut pas être annulée.<br />
                    Veuillez confirmer le passage au statut suivant :<br />
                    <span className="font-bold text-blue-500">{WorkflowStatusText[(workflowStatus + 1) as WorkflowStatus]}</span>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-blue-500 hover:bg-blue-600"
                    onClick={() => handleWorkflowStatusChange(workflowStatus)}
                  >
                    Confirmer
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>
    </>
  )
}

export default WorkflowManager 