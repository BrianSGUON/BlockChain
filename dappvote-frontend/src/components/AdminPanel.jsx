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
      <h2>
        <span style={{ marginRight: '10px' }}>🔐</span>
        Panel Admin
      </h2>

      <div className="admin-section">
        <p style={{ fontSize: '0.85rem', color: '#adb5bd', marginBottom: '12px' }}>
          Gestion de la liste blanche des électeurs
        </p>
        
        <div className="add-voter">
          <input
            type="text"
            className="admin-input" 
            placeholder="Adresse de l'électeur (0x...)"
            value={voterAddress}
            onChange={(e) => setVoterAddress(e.target.value)}
          />
          <button 
            className="admin-action-btn" 
            onClick={handleAdd} 
            disabled={loading || !voterAddress}
          >
            {loading ? "⌛" : "Ajouter"}
          </button>
        </div>
      </div>

      <div className="admin-controls" style={{ marginTop: '24px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px' }}>
        {!votingOpen ? (
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.9rem', marginBottom: '15px', color: '#ffc107' }}>
              ⚠️ Le vote n'est pas encore ouvert aux électeurs.
            </p>
            <button 
              onClick={onStartVoting} 
              disabled={loading} 
              className="start-btn"
            >
              {loading ? "Ouverture en cours..." : "🚀 Lancer la session de vote"}
            </button>
          </div>
        ) : (
          <div className="vote-active-badge" style={{ textAlign: 'center', color: '#5cb85c' }}>
            ✅ La session de vote est actuellement ouverte.
          </div>
        )}
      </div>
    </div>
  );
}