// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

contract Catalogue {
    struct Produit {
        string nom;
        uint256 prix; 
        uint256 quantiteEnStock;
        bool estDisponible;
    }

    mapping(uint256 => Produit) public produits;
    uint256 public prochainId; 

    function ajouterProduit(string memory _nom, uint256 _prix, uint256 _quantite) public returns (uint256) {
        uint256 id = prochainId;
        produits[id] = Produit({
            nom: _nom,
            prix: _prix,
            quantiteEnStock: _quantite,
            estDisponible: _quantite > 0
        });
        prochainId++;
        return id;
    }

    function acheter(uint256 _productId, uint256 _quantite) public {
        Produit storage p = produits[_productId];
        require(p.estDisponible);
        require(p.quantiteEnStock >= _quantite);

        p.quantiteEnStock -= _quantite;
        if (p.quantiteEnStock == 0) {
            p.estDisponible = false;
        }
    }
}