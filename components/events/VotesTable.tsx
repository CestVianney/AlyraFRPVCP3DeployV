import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface Vote {
  voter: string
  proposalId: bigint
}

interface VotesTableProps {
  votes: Vote[]
}

const VotesTable = ({ votes }: VotesTableProps) => {
  return (
    <div className="flex flex-col">
      <h2 className="text-sm font-semibold text-center mb-2">Votes enregistrés</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Votant</TableHead>
            <TableHead>ID Proposition</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {votes.map((vote, index) => (
            <TableRow key={index}>
              <TableCell>{vote.voter}</TableCell>
              <TableCell>{vote.proposalId.toString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default VotesTable 