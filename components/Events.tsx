import TitleDivider from "@/components/TitleDivider"
import { useEventsData } from "@/components/events/EventsData"
import VotersTable from "@/components/events/VotersTable"
import ProposalsTable from "@/components/events/ProposalsTable"
import VotesTable from "@/components/events/VotesTable"
import { LoaderCircle } from "lucide-react"

const Events = () => {
  const { voters, proposals, votes, isLoading } = useEventsData()

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <LoaderCircle className="w-8 h-8 animate-spin mr-2" />
        <span>Chargement des événements...</span>
      </div>
    )
  }

  return (
    <>
      <TitleDivider title="Events" />
      <div className="grid grid-cols-[2fr_1fr_3fr] gap-12 p-4">
        <VotersTable voters={voters} />
        <ProposalsTable proposals={proposals} />
        <VotesTable votes={votes} />
      </div>
    </>
  )
}

export default Events