// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract Voting {
    struct Candidate {
        string name;
        uint256 voteCount;
    }

    address public owner;
    bool public votingOpen;
    
    Candidate[] public candidates;
    mapping(address => bool) public whitelist;
    mapping(address => bool) public hasVoted;

    event VoterAdded(address indexed voter);
    event VotingStarted();
    event VoteCast(address indexed voter, uint256 indexed candidateIndex);

    modifier onlyOwner() {
        require(msg.sender == owner, "Seul l'admin peut faire ca");
        _;
    }

    modifier onlyVoter() {
        require(whitelist[msg.sender], "Pas inscrit sur la liste");
        _;
    }

    constructor(string[] memory _candidateNames) {
        owner = msg.sender;
        for (uint i = 0; i < _candidateNames.length; i++) {
            candidates.push(Candidate({
                name: _candidateNames[i],
                voteCount: 0
            }));
        }
    }

    function addVoter(address _voter) external onlyOwner {
        require(!whitelist[_voter], "Deja inscrit");
        whitelist[_voter] = true;
        emit VoterAdded(_voter);
    }

    function startVoting() external onlyOwner {
        votingOpen = true;
        emit VotingStarted();
    }

    function vote(uint256 _candidateIndex) external onlyVoter {
        require(votingOpen, "Le vote est ferme");
        require(!hasVoted[msg.sender], "Deja vote");
        require(_candidateIndex < candidates.length, "Candidat invalide");

        hasVoted[msg.sender] = true;
        candidates[_candidateIndex].voteCount += 1;

        emit VoteCast(msg.sender, _candidateIndex);
    }

    function getCandidatesCount() external view returns (uint256) {
        return candidates.length;
    }

    function getWinner() external view returns (string memory winnerName) {
        uint256 winningVoteCount = 0;
        uint256 winningIndex = 0;

        for (uint i = 0; i < candidates.length; i++) {
            if (candidates[i].voteCount > winningVoteCount) {
                winningVoteCount = candidates[i].voteCount;
                winningIndex = i;
            }
        }
        return candidates[winningIndex].name;
    }
}