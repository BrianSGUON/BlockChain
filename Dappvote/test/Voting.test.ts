import { expect } from "chai";
import type {} from "mocha";
import hre from "hardhat";

describe("Voting Contract", function () {
  async function deployVotingFixture() {
    const connection = await hre.network.connect();
    const ethers = connection.ethers;
    
    const [owner, voter1, voter2, nonVoter] = await ethers.getSigners();
    const candidatesNames = ["Alice", "Bob", "Charlie"];

    const Voting = await ethers.getContractFactory("Voting");
    const voting = await Voting.deploy(candidatesNames) as any;

    return { voting, owner, voter1, voter2, nonVoter, candidatesNames };
  }

  describe("Deployment", function () {
    it("Doit definir le bon owner", async function () {
      const { voting, owner } = await deployVotingFixture();
      expect(await voting.owner()).to.equal(owner.address);
    });

    it("Doit initialiser les candidats avec 0 votes", async function () {
      const { voting } = await deployVotingFixture();
      const candidate = await voting.candidates(0);
      expect(candidate.voteCount).to.equal(0n);
    });
  });

  describe("Admin Actions", function () {
    it("L'admin peut ajouter un electeur", async function () {
      const { voting, voter1 } = await deployVotingFixture();
      await expect(voting.addVoter(voter1.address))
        .to.emit(voting, "VoterAdded")
        .withArgs(voter1.address);
      expect(await voting.whitelist(voter1.address)).to.be.true;
    });

    it("Un non-admin ne peut pas ajouter d'electeur", async function () {
      const { voting, voter1, voter2 } = await deployVotingFixture();
      await expect(voting.connect(voter1).addVoter(voter2.address))
        .to.be.revertedWith("Seul l'admin peut faire ca");
    });

    it("Impossible d'ajouter deux fois le meme electeur", async function () {
      const { voting, voter1 } = await deployVotingFixture();
      await voting.addVoter(voter1.address);
      await expect(voting.addVoter(voter1.address))
        .to.be.revertedWith("Deja inscrit");
    });
    it("L'admin peut ouvrir le vote", async function () {
      const { voting } = await deployVotingFixture();
      await expect(voting.startVoting())
        .to.emit(voting, "VotingStarted");
      expect(await voting.votingOpen()).to.be.true;
    });
  });

  describe("Voting Process", function () {
    it("Un electeur autorise peut voter et le compteur augmente", async function () {
      const { voting, voter1 } = await deployVotingFixture();
      await voting.addVoter(voter1.address);
      await voting.startVoting();

      await expect(voting.connect(voter1).vote(0n))
        .to.emit(voting, "VoteCast")
        .withArgs(voter1.address, 0n);

      const candidate = await voting.candidates(0);
      expect(candidate.voteCount).to.equal(1n);
    });

    it("Un non-electeur ne peut PAS voter", async function () {
      const { voting, nonVoter } = await deployVotingFixture();
      await voting.startVoting();
      await expect(voting.connect(nonVoter).vote(0n))
        .to.be.revertedWith("Pas inscrit sur la liste");
    });

    it("Impossible de voter deux fois", async function () {
      const { voting, voter1 } = await deployVotingFixture();
      await voting.addVoter(voter1.address);
      await voting.startVoting();

      await voting.connect(voter1).vote(0n);
      await expect(voting.connect(voter1).vote(0n))
        .to.be.revertedWith("Deja vote");
    });

    it("Impossible de voter si le vote est ferme", async function () {
      const { voting, voter1 } = await deployVotingFixture();
      await voting.addVoter(voter1.address);
      await expect(voting.connect(voter1).vote(0n))
        .to.be.revertedWith("Le vote est ferme");
    });

    it("Impossible de voter pour un candidat inexistant", async function () {
      const { voting, voter1 } = await deployVotingFixture();
      await voting.addVoter(voter1.address);
      await voting.startVoting();
      await expect(voting.connect(voter1).vote(99n))
        .to.be.revertedWith("Candidat invalide");
    });
  });

  describe("Results", function () {
    it("La fonction getWinner retourne le bon gagnant", async function () {
      const { voting, voter1, voter2 } = await deployVotingFixture();
      await voting.addVoter(voter1.address);
      await voting.addVoter(voter2.address);
      await voting.startVoting();

      await voting.connect(voter1).vote(1n);
      await voting.connect(voter2).vote(1n);

      expect(await voting.getWinner()).to.equal("Bob");
    });
    it("En cas d egalite, retourne le premier candidat en tete", async function () {
      const { voting, voter1, voter2 } = await deployVotingFixture();
      await voting.addVoter(voter1.address);
      await voting.addVoter(voter2.address);
      await voting.startVoting();

      await voting.connect(voter1).vote(0n); // Vote pour Alice
      await voting.connect(voter2).vote(1n); // Vote pour Bob

      // Egalite 1-1, getWinner retourne le premier (Alice, index 0)
      expect(await voting.getWinner()).to.equal("Alice");
    });
  });
});

export {};