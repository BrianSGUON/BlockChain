export default function VoterPanel({ candidates, votingOpen, hasVoted, onVote, loading }) {
  if (hasVoted) {
    return (
      <div className="panel voter-panel">
        <h2>Votre vote</h2>
        <p className="voted-msg">✅ Vous avez déjà voté</p>
      </div>
    );
  }

  if (!votingOpen) {
    return (
      <div className="panel voter-panel">
        <h2>Votre vote</h2>
        <p>Le vote n'est pas encore ouvert.</p>
      </div>
    );
  }

  return (
    <div className="panel voter-panel">
      <h2>Voter</h2>
      <div className="candidates-list">
        {candidates.map((c) => (
          <button
            key={c.index}
            onClick={() => onVote(c.index)}
            disabled={loading}
            className="candidate-btn"
          >
            {loading ? "En cours..." : `Voter pour ${c.name}`}
          </button>
        ))}
      </div>
    </div>
  );
}