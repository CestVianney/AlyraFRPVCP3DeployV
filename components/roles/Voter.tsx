import InfoSection from "@/components/roles/voter/InfoSection"
import AddProposal from "@/components/roles/voter/AddProposal"
import VoteProposal from "@/components/roles/voter/VoteProposal"
import { useWorkflowStatus } from "@/hooks/workflows"
import { useEffect, useState } from "react"

const Voter = () => {

  const workflowStatus = useWorkflowStatus()
  const [currentWorkflowStatus, setCurrentWorkflowStatus] = useState(workflowStatus)

  useEffect(() => {
    setCurrentWorkflowStatus(workflowStatus)
  }, [workflowStatus])

  return (
    <div className="flex flex-col w-full items-center justify-center space-y-4">
      <InfoSection />
      <AddProposal workflowStatus={currentWorkflowStatus} />
      <VoteProposal workflowStatus={currentWorkflowStatus} />
    </div>
  )
}

export default Voter