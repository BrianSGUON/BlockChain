// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

error CodeIncorrect(uint256 codeEntre);
error SeulProprietaire(address appelant);
error CoffreVerrouille();
error MontantTropEleve(uint256 demande, uint256 maximum);

contract CoffreFort {
    address public proprietaire;
    uint256 private codeSecret;
    bool public estOuvert;
    uint256 public constant RETRAIT_MAX = 1 ether;

    event CoffreOuvert(address indexed par);
    event Retrait(address indexed vers, uint256 montant);

    constructor(uint256 _code) {
        proprietaire = msg.sender;
        codeSecret = _code;
    }

    function deposer() public payable {}

    function ouvrir(uint256 _code) public {
        if (_code != codeSecret) revert CodeIncorrect(_code);
        estOuvert = true;
        emit CoffreOuvert(msg.sender);
    }

    function retirer(uint256 _montant) public {
        if (msg.sender != proprietaire) revert SeulProprietaire(msg.sender);
        if (!estOuvert) revert CoffreVerrouille();
        if (_montant > RETRAIT_MAX) revert MontantTropEleve(_montant, RETRAIT_MAX);

        estOuvert = false;
        (bool success, ) = payable(msg.sender).call{value: _montant}("");
        require(success, "Transfert echoue");
        emit Retrait(msg.sender, _montant);
    }
}