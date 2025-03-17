'use client'

import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import { useRoles, UserRoleEnum } from "@/hooks/userRoles";

import Owner from "@/components/roles/Owner";
import Voter from "@/components/roles/Voter";
import Visitor from "@/components/roles/Visitor";
import NotConnected from "@/components/roles/NotConnected";
import Events from "@/components/Events";
import Workflow from "@/components/Workflow";
import { LoaderCircle } from "lucide-react";
import { useWorkflowStatus } from "@/hooks/workflows";
import VoteEnded from "@/components/VoteEnded";

export default function Home() {
  const roles = useRoles()
  const { address, isConnecting, isConnected } = useAccount()
  const [isOwner, setIsOwner] = useState(false)
  const [isVoter, setIsVoter] = useState(false)

  const workflowStatus = useWorkflowStatus()

  useEffect(() => {
    if (isConnected) {
      setIsOwner(roles.includes(UserRoleEnum.OWNER))
      setIsVoter(roles.includes(UserRoleEnum.VOTER))
    }
  }, [isConnected, roles])

  if (isConnecting) {
    return (
      <div className="flex flex-grow justify-center items-center h-full gap-2">
        <LoaderCircle className="w-10 h-10 animate-spin" />
        <div className="flex flex-col items-center justify-center gap-2 text-xl font-bold">
          Loading ...
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col flex-grow p-5"> 
      {workflowStatus == 5 && <VoteEnded />}
      {!isConnected 
        ? <NotConnected />
        : (
          <>
            {isOwner || isVoter 
              ? (
                <>
                  <Workflow />
                  {isOwner && <Owner />}
                  {isVoter && <Voter />}
                  <Events />
                </>
              )
              : <Visitor />
            }
          </>
        )
      }
    </div>
  )
}
