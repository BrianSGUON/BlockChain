// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/access/Ownable.sol";

contract VoteDApp is Ownable {

    struct Candidat {
        uint256 id;
        string nom;
        uint256 nbVotes;
    }

    struct Electeur {
        bool estEnregistre;
        bool aVote;
        uint256 idCandidatChoisi;
    }

    mapping(address => Electeur) public electeurs;
    Candidat[] public candidats;
    bool public voteOuvert;

    event ElecteurEnregistre(address indexed electeur);
    event VoteFinalise(address indexed electeur, uint256 indexed candidatId);
    event StatutVoteChange(bool nouveauStatut);

    constructor() Ownable(msg.sender) {
        voteOuvert = false; // Le vote est fermé par défaut
    }

    function enregistrerElecteur(address _electeur) external onlyOwner {
        require(!electeurs[_electeur].estEnregistre, "Electeur deja inscrit");
        electeurs[_electeur].estEnregistre = true;
        emit ElecteurEnregistre(_electeur);
    }

    function ajouterCandidat(string memory _nom) external onlyOwner {
        require(!voteOuvert, "Impossible d'ajouter un candidat pendant le vote");
        uint256 id = candidats.length;
        candidats.push(Candidat(id, _nom, 0));
    }

    function changerStatutVote(bool _statut) external onlyOwner {
        voteOuvert = _statut;
        emit StatutVoteChange(_statut);
    }

    function voter(uint256 _candidatId) external {
        require(voteOuvert, "Le vote n'est pas encore ouvert");
        require(electeurs[msg.sender].estEnregistre, "Tu n'es pas inscrit sur la liste");
        require(!electeurs[msg.sender].aVote, "Tu as deja vote");
        require(_candidatId < candidats.length, "Candidat inexistant");

        electeurs[msg.sender].aVote = true;
        electeurs[msg.sender].idCandidatChoisi = _candidatId;

        candidats[_candidatId].nbVotes++;

        emit VoteFinalise(msg.sender, _candidatId);
    }


    function getResultats() external view returns (Candidat[] memory) {
        return candidats;
    }
}