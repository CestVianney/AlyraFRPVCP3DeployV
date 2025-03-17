import { Info } from "lucide-react"
import { useReadContract } from "wagmi"
import { VOTING_CONTRACT_ADDRESS, VOTING_CONTRACT_ABI } from "@/constants/votingContract"
import { useEffect, useState } from "react"

export default function VoteEnded() {
    const [description, setDescription] = useState("")

    const {data: idWinningProposal} = useReadContract({
        abi: VOTING_CONTRACT_ABI,
        address: VOTING_CONTRACT_ADDRESS,
        functionName: "winningProposalID",
    })

    const {data: winningProposal}: { data: { description: string } | undefined } = useReadContract({
        abi: VOTING_CONTRACT_ABI,
        address: VOTING_CONTRACT_ADDRESS,
        functionName: "getOneProposal",
        args: [idWinningProposal],
    })

    useEffect(() => {
        if (winningProposal) {
            setDescription(winningProposal.description)
        }
    }, [winningProposal])

    return (
        <div className="flex flex-col p-4 border rounded shadow-md gap-2 bg-gray-100">
            <div className="flex flex-row items-center gap-2">
                <Info className="w-6 h-6" />
                <h2 className="text-xl font-semibold">
                    Le processus de vote est terminé !
                </h2>
            </div>
            <p className="mt-2 text-bold">La proposition retenue est la suivante : <span className="font-bold">{description}</span></p>
        </div>
    )
}
