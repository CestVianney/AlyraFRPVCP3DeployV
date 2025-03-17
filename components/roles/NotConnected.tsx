import {
    Alert,
    AlertTitle,
    AlertDescription
} from "@/components/ui/alert"

const NotConnected = () => {

  return (
    <>
      <Alert className="bg-red-500 text-white">
        <AlertTitle className="font-bold">
            Veuillez vous connecter
        </AlertTitle>
        <AlertDescription>
          Vous devez vous connecter à votre wallet pour accéder à l'application.
        </AlertDescription>
      </Alert>
    </>
  )
}

export default NotConnected 