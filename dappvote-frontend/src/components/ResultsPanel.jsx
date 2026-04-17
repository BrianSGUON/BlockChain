export default function ResultsPanel({ candidates }) {
  const total = candidates.reduce((sum, c) => sum + Number(c.voteCount), 0);
  const max = Math.max(...candidates.map((c) => Number(c.voteCount)));
  const winner = candidates.find((c) => Number(c.voteCount) === max && max > 0);

  return (
    <div className="panel results-panel">
      <h2>
        <span style={{ marginRight: '10px' }}>📊</span> 
        Résultats
      </h2>

      {winner && (
        <div className="winner-banner">
          <span style={{ fontSize: '1.4rem' }}>🏆</span>
          <div>
            <strong>Gagnant actuel : {winner.name}</strong>
            <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>
              {winner.voteCount} vote{winner.voteCount !== 1 ? "s" : ""} — {Math.round((winner.voteCount / total) * 100)}%
            </div>
          </div>
        </div>
      )}

      <div className="results-list" style={{ marginTop: '20px' }}>
        {candidates.map((c) => {
          const voteCount = Number(c.voteCount);
          const pct = total > 0 ? Math.round((voteCount / total) * 100) : 0;
          const isWinner = voteCount === max && max > 0;
          
          return (
            <div key={c.index} className={`result-row ${isWinner ? "winner" : ""}`}>
              <div className="result-row-header">
                <span className="candidate-name">
                  {isWinner && <span style={{ color: '#ffc107', marginRight: '8px' }}>★</span>}
                  {c.name}
                </span>
                <span className="vote-count">
                  {voteCount} {voteCount > 1 ? "votes" : "vote"} • {pct}%
                </span>
              </div>
              
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${pct}%` }} 
                />
              </div>
            </div>
          );
        })}
      </div>

      {total === 0 && (
        <div style={{ textAlign: 'center', padding: '20px', color: "#adb5bd", fontStyle: 'italic' }}>
          Aucun vote n'a été enregistré pour le moment.
        </div>
      )}
    </div>
  );
}