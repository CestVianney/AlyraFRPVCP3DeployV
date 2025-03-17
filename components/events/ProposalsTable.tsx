import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface ProposalsTableProps {
  proposals: bigint[]
}

const ProposalsTable = ({ proposals }: ProposalsTableProps) => {
  return (
    <div className="flex flex-col">
      <h2 className="text-sm font-semibold text-center mb-2">Propositions enregistrées</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID Proposition</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {proposals.map((proposalId, index) => (
            <TableRow key={index}>
              <TableCell>{proposalId.toString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default ProposalsTable 