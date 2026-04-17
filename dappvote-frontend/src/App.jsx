import { useVoting } from "./hooks/useVoting";
import ConnectWallet from "./components/ConnectWallet";
import StatusBanner from "./components/StatusBanner";
import AdminPanel from "./components/AdminPanel";
import VoterPanel from "./components/VoterPanel";
import ResultsPanel from "./components/ResultsPanel";
import "./App.css";

export default function App() {
  const {
    account, candidates, votingOpen, isOwner, isVoter, hasVoted,
    loading, error, txHash, connectWallet, addVoter, startVoting, vote
  } = useVoting();

  return (
    <div className="app">
      <header>
        <h1>🗳️ DApp Vote</h1>
        <ConnectWallet account={account} onConnect={connectWallet} />
      </header>

      {error && <div className="error-msg">❌ {error}</div>}
      {txHash && <div className="tx-msg">✅ Transaction : {txHash.slice(0, 20)}...</div>}

      {account && (
        <>
          <StatusBanner votingOpen={votingOpen} isOwner={isOwner} isVoter={isVoter} />
          {isOwner && (
            <AdminPanel
              votingOpen={votingOpen}
              onAddVoter={addVoter}
              onStartVoting={startVoting}
              loading={loading}
            />
          )}
          {isVoter && (
            <VoterPanel
              candidates={candidates}
              votingOpen={votingOpen}
              hasVoted={hasVoted}
              onVote={vote}
              loading={loading}
            />
          )}
          <ResultsPanel candidates={candidates} />
        </>
      )}

      {!account && (
        <div className="welcome">
          <p>Connectez votre wallet MetaMask pour participer au vote.</p>
        </div>
      )}
    </div>
  );
}