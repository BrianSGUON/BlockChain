import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const VotingModule = buildModule("VotingModule", (m) => {
  const candidateNames = m.getParameter("candidateNames", ["Alice", "Bob", "Charlie"]);
  
  const voting = m.contract("Voting", [candidateNames]);

  return { voting };
});

export default VotingModule;