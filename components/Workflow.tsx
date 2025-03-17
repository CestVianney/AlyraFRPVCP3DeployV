import { useWorkflowStatus, WorkflowStatusText } from '@/hooks/workflows'
import { Info } from "lucide-react"
export default function Workflow() {
    const workflowStatus = useWorkflowStatus()
    const workflowSteps = 
    [WorkflowStatusText[0], 
    WorkflowStatusText[1], 
    WorkflowStatusText[2],
    WorkflowStatusText[3], 
    WorkflowStatusText[4], 
    WorkflowStatusText[5]]

    return (
        <div className="flex flex-col p-4 border rounded shadow-md gap-2 bg-gray-100">
            <div className="flex flex-row items-center gap-2">
                <Info className="w-6 h-6" />
                <h2 className="text-xl font-semibold">
                    Statut actuel du Workflow
                </h2>
            </div>
            <p className="mt-2 text-bold">{WorkflowStatusText[workflowStatus]}</p>
            <div className="flex mt-4 flex-col">
                <div className="flex mb-2">
                    {workflowSteps.map((step, index) => (
                        <div 
                            key={index} 
                            className={`flex-1 text-center text-xs ${index > workflowStatus ? 'text-gray-400' : ''}`}
                        >
                            {step}
                        </div>
                    ))}
                </div>
                <div className="flex">
                    {[...Array(6)].map((_, index) => (
                        <div
                            key={index}
                            className={`flex-1 h-2 ${index <= workflowStatus ? 'bg-blue-500' : 'bg-gray-300'} mx-1`}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}
