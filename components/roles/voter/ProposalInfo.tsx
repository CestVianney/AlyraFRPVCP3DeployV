import { useEffect, useState } from "react"
import { useReadContracts } from "wagmi"
import { useEventsData } from "@/components/events/EventsData"
import { VOTING_CONTRACT_ABI, VOTING_CONTRACT_ADDRESS } from "@/constants/votingContract"
import TitleDivider from "@/components/TitleDivider"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"

interface ProposalInfoProps {
  workflowStatus: number;
}

const ProposalInfo = ({ workflowStatus }: ProposalInfoProps) => {
  const [propositionsList, setPropositionsList] = useState<{ voteCount: number; description: string, index: number }[]>([])
  const [currentPage, setCurrentPage] = useState(1);
  const proposalsPerPage = 5;
  const { proposals, votes } = useEventsData()

  const contracts = proposals.map((proposal, index) => ({
    abi: VOTING_CONTRACT_ABI,
    address: VOTING_CONTRACT_ADDRESS,
    functionName: "getOneProposal",
    args: [index + 1],
  }))

  const { data: proposalData } = useReadContracts({
    contracts: contracts,
    query: { enabled: proposals.length > 0 },
  })

  useEffect(() => {
    if (proposalData) {
      const processedProposalData = proposalData.map((data, index) => ({
        description: data?.result?.description ?? "",
        voteCount: data?.result?.voteCount ?? 0,
        index: index + 1,
      }))
      processedProposalData.sort((a, b) => b.voteCount - a.voteCount)
      setPropositionsList(processedProposalData)
    }
  }, [proposalData])

  useEffect(() => {
    setPropositionsList((prevPropositionsList) =>
      prevPropositionsList.map((proposal) => ({
        ...proposal,
        voteCount: votes.filter((vote) => vote.proposalId === BigInt(proposal.index)).length,
      }))
    );
  }, [votes]);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const paginatedProposals = propositionsList.slice((currentPage - 1) * proposalsPerPage, currentPage * proposalsPerPage);

  while (paginatedProposals.length < proposalsPerPage) {
    paginatedProposals.push({ description: "", voteCount: 0, index: 0 });
  }

  return (
    <div className="flex flex-col w-full px-5 gap-2">
      <TitleDivider title="Liste des propositions" />
      {workflowStatus === 0 ? (
        <p>La session d'enregistrement des propositions n'a pas encore commencé.</p>
      ) : 
      proposals.length == 0 ? (
        <p>Aucune proposition enregistrée.</p>
      ) : (
        <div className="mt-4 max-h-64 overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Index</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Nombre de votes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedProposals.map((proposal, index) => (
                <TableRow key={index}>
                  <TableCell>{proposal.description ? proposal.index : ""}</TableCell>
                  <TableCell>{proposal.description}</TableCell>
                  <TableCell>{proposal.voteCount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      <div className="flex justify-center mt-4 gap-4">
        <Button 
        className="bg-blue-500 hover:bg-blue-400"
        onClick={handlePreviousPage} disabled={currentPage === 1}>
          Previous
        </Button>
        <Button
        className="bg-blue-500 hover:bg-blue-400"
        onClick={handleNextPage} disabled={currentPage * proposalsPerPage >= propositionsList.length}>
          Next
        </Button>
      </div>
    </div>
  )
}

export default ProposalInfo