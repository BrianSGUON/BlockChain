export default function ResultsPanel({ candidates }) {
  const total = candidates.reduce((sum, c) => sum + c.voteCount, 0);
  const max = Math.max(...candidates.map((c) => c.voteCount));

  return (
    <div className="panel results-panel">
      <h2>Résultats</h2>
      {candidates.map((c) => {
        const pct = total > 0 ? Math.round((c.voteCount / total) * 100) : 0;
        const isWinner = c.voteCount === max && max > 0;
        return (
          <div key={c.index} className={`result-row ${isWinner ? "winner" : ""}`}>
            <span className="candidate-name">
              {isWinner ? "🏆 " : ""}{c.name}
            </span>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${pct}%` }} />
            </div>
            <span className="vote-info">{c.voteCount} vote{c.voteCount !== 1 ? "s" : ""} ({pct}%)</span>
          </div>
        );
      })}
      {total === 0 && <p>Aucun vote pour le moment.</p>}
    </div>
  );
}