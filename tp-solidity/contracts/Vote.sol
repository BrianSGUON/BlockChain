// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Vote {
    struct Proposition {
        string description;
        uint256 nombreDeVotes;
    }

    Proposition[] public propositions;
    mapping(address => bool) public aDejaVote;
    address public admin;

    event PropositionAjoutee(uint256 indexed id, string description);
    event VoteEffectue(address indexed votant, uint256 indexed propositionId);

    constructor() {
        admin = msg.sender;
    }

    function ajouterProposition(string memory _description) public {
        require(msg.sender == admin, "Admin seulement");
        propositions.push(Proposition(_description, 0));
        emit PropositionAjoutee(propositions.length - 1, _description);
    }

    function voter(uint256 _id) public {
        require(!aDejaVote[msg.sender], "Deja vote");
        require(_id < propositions.length, "Invalide");

        propositions[_id].nombreDeVotes++;
        aDejaVote[msg.sender] = true;
        emit VoteEffectue(msg.sender, _id);
    }

    function getGagnant() public view returns (uint256 idGagnant) {
        uint256 maxVotes = 0;
        for (uint256 i = 0; i < propositions.length; i++) {
            if (propositions[i].nombreDeVotes > maxVotes) {
                maxVotes = propositions[i].nombreDeVotes;
                idGagnant = i;
            }
        }
    }
}