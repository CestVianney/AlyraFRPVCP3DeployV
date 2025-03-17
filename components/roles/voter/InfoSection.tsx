import TitleDivider from "@/components/TitleDivider"
import VoterInfo from "@/components/roles/voter/VoterInfo"
import ProposalInfo from "@/components/roles/voter/ProposalInfo"
import { useWorkflowStatus } from "@/hooks/workflows"

const InfoSection = () => {
  const workflowStatus = useWorkflowStatus()
  return (
    <>
      <TitleDivider title="Obtenir des informations" />
      <div className="flex w-full justify-center space-x-12">
        <VoterInfo />
        <ProposalInfo workflowStatus={workflowStatus} />
      </div>
    </>
  )
}

export default InfoSection