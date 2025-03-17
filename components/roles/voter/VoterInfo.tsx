import { useState, useEffect } from "react";
import { useReadContracts } from "wagmi";
import { VOTING_CONTRACT_ABI, VOTING_CONTRACT_ADDRESS } from "@/constants/votingContract";
import TitleDivider from "@/components/TitleDivider";
import { useEventsData } from "@/components/events/EventsData";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Abi, getAddress } from "viem";
import { Button } from "@/components/ui/button";

interface VoterData {
  result: {
    hasVoted: boolean;
    votedProposalId: number;
  };
}

const VoterInfo = () => {
  const [voterList, setVoterList] = useState<{ address: string; hasVoted: boolean; votedProposalId: number }[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const votersPerPage = 5;
  const { voters, proposals, votes } = useEventsData();

  const contracts = voters.map((voter) => ({
    abi: VOTING_CONTRACT_ABI as Abi,
    address: VOTING_CONTRACT_ADDRESS as `0x${string}`,
    functionName: "getVoter",
    args: [getAddress(voter.toLowerCase())],
  }));

  const { data: voterData } = useReadContracts({
    contracts: contracts,
    query: { enabled: voters.length > 0 },
  });

  useEffect(() => {
    if (voterData) {
      console.log("voterData:", voterData);
      const processedVoterData = voterData.map((data, index) =>{
        const result = data?.result as VoterData['result'];
        return {
        address: voters[index],
        hasVoted: result?.hasVoted ?? false,
        votedProposalId: result?.votedProposalId ?? null,
        }
      });
      setVoterList(processedVoterData);
    }
  }, [voterData]);

  useEffect(() => {
      setVoterList((prevVoterList) =>
        prevVoterList.map((voter) => ({
          ...voter,
          hasVoted: votes.some((vote) => vote.voter === voter.address),
          votedProposalId: Number(votes.find((vote) => vote.voter === voter.address)?.proposalId ?? voter.votedProposalId),
        }))
      );
    }, [votes]);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const paginatedVoters = voterList.slice((currentPage - 1) * votersPerPage, currentPage * votersPerPage);

  while (paginatedVoters.length < votersPerPage) {
    paginatedVoters.push({ address: "", hasVoted: false, votedProposalId: 0 });
  }

  return (
    <div className="flex flex-col w-full px-5 gap-2">
      <TitleDivider title="Statut votants" />
      <div className="mt-4 max-h-64 overflow-y-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Address</TableHead>
              {proposals.map((proposal, index) => (
                <TableHead key={index}>{index + 1}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedVoters.map((voter, index) => (
              <TableRow key={index}>
                <TableCell>{voter.address ? `${voter.address.slice(0, 4)}....${voter.address.slice(-4)}` : ""}</TableCell>
                {proposals.map((proposal, proposalIndex) => (
                  <TableCell key={proposalIndex}>
                    {votes.some((vote) => vote.voter === voter.address && vote.proposalId === BigInt(proposalIndex + 1)) ? (
                      <div className="w-4 h-4 bg-green-500"></div>
                    ) : (
                      <div className="w-4 h-4 border border-gray-500"></div>
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-center mt-4 gap-4">
        <Button 
        className="bg-blue-500 hover:bg-blue-400"
        onClick={handlePreviousPage} disabled={currentPage === 1}>
          Previous
        </Button>
        <Button
        className="bg-blue-500 hover:bg-blue-400"
        onClick={handleNextPage} disabled={currentPage * votersPerPage >= voterList.length}>
          Next
        </Button>
      </div>
    </div>
  );
};

export default VoterInfo;
