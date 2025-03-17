import AddVoter from "@/components/roles/owner/AddVoter"
import WorkflowManager from "@/components/roles/owner/WorkflowManager"
import { useWorkflowStatus } from "@/hooks/workflows"

const Owner = () => {

  const workflowStatus = useWorkflowStatus()

  return (
    <div className="flex flex-col w-full items-center justify-center space-y-4">
      {workflowStatus == 0 ? <AddVoter /> : null}
      <WorkflowManager />
    </div>
  )
}

export default Owner