import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { VOTING_CONTRACT_ADDRESS, VOTING_CONTRACT_ABI } from "@/constants/votingContract"
import { Spinner } from "@/components/ui/loadingspinner"
import TitleDivider from "@/components/TitleDivider"
import { getAddress } from "viem"

const AddVoter = () => {
  const [voterAddress, setVoterAddress] = useState("")
  const { writeContract } = useWriteContract()
  const {isLoading: isConfirming} = useWaitForTransactionReceipt()
  const [error, setError] = useState<string | null>(null)

  const handleAddVoter = async () => {
    if (!voterAddress) return
    
    try {
      const tx = await writeContract({
        abi: VOTING_CONTRACT_ABI,
        address: VOTING_CONTRACT_ADDRESS,
        functionName: 'addVoter',
        args: [getAddress(voterAddress.toLowerCase())],
      })
      
      setVoterAddress("")
      setError(null)
    } catch (err) {
      console.error("Failed to add voter:", err)
      setError("Failed to add voter. Please try again.")
    }
  }

  return (
    <>
      <TitleDivider title="Ajouter un votant" />
      <div className="flex flex-col items-center px-4 justify-center">
        <div className="flex flex-row gap-2">
          <Input
            id="add-voter-button"
            type="text"
            placeholder="Adresse du votant"
            value={voterAddress}
            onChange={(e) => setVoterAddress(e.target.value)}
          />
          {isConfirming ? 
          <Spinner /> :
          (
            <Button 
              className="bg-blue-400 hover:bg-blue-300" 
              onClick={handleAddVoter}
            >
              Ajouter
            </Button>
          )}
        </div>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    </>
  )
}

export default AddVoter