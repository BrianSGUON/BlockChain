export const CONTRACT_ADDRESS = "0x4C571EBc5aC28dC19Eb69eEadDB0bCCA34Af3c69";

export const CONTRACT_ABI = [
  "constructor(string[] _candidateNames)",
  "function addVoter(address _voter)",
  "function startVoting()",
  "function vote(uint256 _candidateIndex)",
  "function candidates(uint256) view returns (string name, uint256 voteCount)",
  "function getCandidatesCount() view returns (uint256)",
  "function getWinner() view returns (string winnerName)",
  "function owner() view returns (address)",
  "function votingOpen() view returns (bool)",
  "function whitelist(address) view returns (bool)",
  "function hasVoted(address) view returns (bool)",
  "event VoterAdded(address indexed voter)",
  "event VotingStarted()",
  "event VoteCast(address indexed voter, uint256 indexed candidateIndex)"
];