import { useState, useCallback } from "react";
import { BrowserProvider, Contract } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../constants/contract.js";

export function useVoting() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [votingOpen, setVotingOpen] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [isVoter, setIsVoter] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [txHash, setTxHash] = useState(null);

  const loadCandidates = useCallback(async (contractInstance) => {
    const count = await contractInstance.getCandidatesCount();
    const list = [];
    for (let i = 0; i < count; i++) {
      const c = await contractInstance.candidates(i);
      list.push({ name: c.name, voteCount: Number(c.voteCount), index: i });
    }
    setCandidates(list);
  }, []);

  const loadVotingStatus = useCallback(async (contractInstance) => {
    const open = await contractInstance.votingOpen();
    setVotingOpen(open);
  }, []);

  const loadUserStatus = useCallback(async (contractInstance, userAddress) => {
    const owner = await contractInstance.owner();
    const voter = await contractInstance.whitelist(userAddress);
    const voted = await contractInstance.hasVoted(userAddress);
    setIsOwner(owner.toLowerCase() === userAddress.toLowerCase());
    setIsVoter(voter);
    setHasVoted(voted);
  }, []);

  const refresh = useCallback(async (contractInstance, userAddress) => {
    await loadCandidates(contractInstance);
    await loadVotingStatus(contractInstance);
    await loadUserStatus(contractInstance, userAddress);
  }, [loadCandidates, loadVotingStatus, loadUserStatus]);

  const connectWallet = useCallback(async () => {
    try {
      setError(null);
      if (!window.ethereum) throw new Error("MetaMask non installé");

      const _provider = new BrowserProvider(window.ethereum);
      await _provider.send("eth_requestAccounts", []);
      const _signer = await _provider.getSigner();
      const _account = await _signer.getAddress();
      const _contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, _signer);

      setProvider(_provider);
      setSigner(_signer);
      setAccount(_account);
      setContract(_contract);

      await refresh(_contract, _account);

      // Ecoute les events
      _contract.on("VoterAdded", () => refresh(_contract, _account));
      _contract.on("VotingStarted", () => refresh(_contract, _account));
      _contract.on("VoteCast", () => refresh(_contract, _account));

    } catch (err) {
      setError(err.message);
    }
  }, [refresh]);

  const addVoter = useCallback(async (address) => {
    try {
      setLoading(true);
      setError(null);
      const tx = await contract.addVoter(address);
      setTxHash(tx.hash);
      await tx.wait();
    } catch (err) {
      setError(err.reason || err.message);
    } finally {
      setLoading(false);
    }
  }, [contract]);

  const startVoting = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const tx = await contract.startVoting();
      setTxHash(tx.hash);
      await tx.wait();
    } catch (err) {
      setError(err.reason || err.message);
    } finally {
      setLoading(false);
    }
  }, [contract]);

  const vote = useCallback(async (candidateIndex) => {
    try {
      setLoading(true);
      setError(null);
      const tx = await contract.vote(candidateIndex);
      setTxHash(tx.hash);
      await tx.wait();
    } catch (err) {
      setError(err.reason || err.message);
    } finally {
      setLoading(false);
    }
  }, [contract]);

  return {
    account, candidates, votingOpen, isOwner, isVoter, hasVoted,
    loading, error, txHash, connectWallet, addVoter, startVoting, vote
  };
}