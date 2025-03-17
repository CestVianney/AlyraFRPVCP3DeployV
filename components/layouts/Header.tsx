import { ConnectButton } from "@rainbow-me/rainbowkit";

function Header() {
  return (
    <div className="bg-gray-300 flex items-center justify-between p-5 h-32">
        <div className="flex items-center gap-4">
          <img src="/images/logoVoting.png" alt="logo" className="w-24 h-24" />
          </div>
        <h1 className="text-2xl font-bold">
            Alyra Voting System
        </h1>
        <ConnectButton />
    </div>
  )
}

export default Header