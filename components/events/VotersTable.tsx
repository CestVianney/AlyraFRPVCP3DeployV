import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface VotersTableProps {
  voters: string[]
}

const VotersTable = ({ voters }: VotersTableProps) => {
  return (
    <div className="flex flex-col">
      <h2 className="text-sm font-semibold text-center mb-2">Votants enregistrés</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Adresse</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {voters.map((address, index) => (
            <TableRow key={index}>
              <TableCell className="break-all whitespace-normal max-w-0">{address}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default VotersTable 