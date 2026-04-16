export default function StatusBanner({ votingOpen, isOwner, isVoter }) {
  const role = isOwner ? "ADMIN" : isVoter ? "ÉLECTEUR" : "VISITEUR";
  const roleClass = isOwner ? "admin" : isVoter ? "voter" : "visitor";

  return (
    <div className="status-banner">
      <span className={`vote-status ${votingOpen ? "open" : "closed"}`}>
        Vote : {votingOpen ? "OUVERT" : "FERMÉ"}
      </span>
      <span className={`role-badge ${roleClass}`}>{role}</span>
    </div>
  );
}