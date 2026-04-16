import { useState } from "react";

export default function AdminPanel({ votingOpen, onAddVoter, onStartVoting, loading }) {
  const [voterAddress, setVoterAddress] = useState("");

  const handleAdd = async () => {
    if (!voterAddress) return;
    await onAddVoter(voterAddress);
    setVoterAddress("");
  };

  return (
    <div className="panel admin-panel">
      <h2>Panel Admin</h2>
      <div className="add-voter">
        <input
          type="text"
          placeholder="Adresse de l'électeur (0x...)"
          value={voterAddress}
          onChange={(e) => setVoterAddress(e.target.value)}
        />
        <button onClick={handleAdd} disabled={loading}>
          {loading ? "En cours..." : "Ajouter électeur"}
        </button>
      </div>
      {!votingOpen && (
        <button onClick={onStartVoting} disabled={loading} className="start-btn">
          {loading ? "En cours..." : "Ouvrir le vote"}
        </button>
      )}
    </div>
  );
}