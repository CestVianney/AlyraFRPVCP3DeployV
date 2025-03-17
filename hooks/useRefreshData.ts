import { useCallback } from "react"
import { useQueryClient } from "@tanstack/react-query"

const useRefreshData = () => {
  const queryClient = useQueryClient()

  const refreshData = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["voterInfo"] })
    queryClient.invalidateQueries({ queryKey: ["proposalInfo"] }) 
  }, [queryClient])

  return refreshData
}

export default useRefreshData