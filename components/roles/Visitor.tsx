import {
  Alert,
  AlertDescription,
  AlertTitle
} from "@/components/ui/alert"

const Visitor = () => {
  return (
    <div className="flex flex-col flex-grow p-5">
      <Alert className="bg-yellow-100">
        <AlertTitle className="text-bold">Problème d'accès</AlertTitle>
        <AlertDescription>
          Seul les votants enregistrés ou le propriétaire peuvent accéder à l'application.
        </AlertDescription>
      </Alert>
    </div>
  )
}

export default Visitor