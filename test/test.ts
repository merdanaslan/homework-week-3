import { expect } from "chai";
import { ethers } from "hardhat";
import { MyToken, MyToken__factory, TokenizedBallot, TokenizedBallot__factory } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { type } from "os";


describe("Testing ERC20 Ballot", async () => {

  let deployer: HardhatEthersSigner;
  let acc1: HardhatEthersSigner;
  let acc2: HardhatEthersSigner;
  let myTokenContract: MyToken;
  let TokenizedBallotContract: TokenizedBallot
  const amount100 = ethers.parseEther("100");
  const amount50 = ethers.parseEther("50");
  function getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  function getProposals() {
    const text: string[] = ["one", "two", "three", "four", "five", "six"];
    const bytes = text.map(ethers.encodeBytes32String);
    return { text, bytes }
  }
  async function deployContracts(deployer: HardhatEthersSigner) {


    const myTokenContractFactory = new MyToken__factory(deployer);
    const myTokenContract_ = await myTokenContractFactory.deploy();
    await myTokenContract_.waitForDeployment();
    await myTokenContract_.mint(deployer, amount100);
    await myTokenContract_.delegate(deployer);

    const tokenizedBallotFactory = new TokenizedBallot__factory(deployer);
    const blockNumber = await ethers.provider.getBlockNumber();
    const tokenizedBallotContract_ = await tokenizedBallotFactory.deploy(getProposals().bytes, await myTokenContract_.getAddress(), blockNumber);
    await tokenizedBallotContract_.waitForDeployment();

    return { myTokenContract_, tokenizedBallotContract_ }
  }
  beforeEach(async () => {
    [deployer, acc1, acc2] = await ethers.getSigners();
    const { myTokenContract_, tokenizedBallotContract_ } = await deployContracts(deployer);
    myTokenContract = myTokenContract_;
    TokenizedBallotContract = tokenizedBallotContract_;
  });

  async function getLastedBlock() {
    return await ethers.provider.getBlockNumber();
  }
  describe("Deployments", async () => {
    it("myToken deployment", async () => {
      const address = await myTokenContract.getAddress()
      expect(address).to.match(/^0x[a-fA-F0-9]{40}$/)
    })
    it("TokenizedBallot deployment", async () => {
      const address = await TokenizedBallotContract.getAddress()
      expect(address).to.match(/^0x[a-fA-F0-9]{40}$/)
    })
  })
  describe("ERC20", async () => {

    it("mint token", async () => {
      await myTokenContract.mint(acc1, amount100);
      const balance = (await myTokenContract.balanceOf(acc1)).toString()
      await expect(balance).to.equal(amount100);
    })
    it("transfer token", async () => {
      await myTokenContract.transfer(acc2, amount50)
      const oldBalance = (await myTokenContract.balanceOf(deployer)).toString();
      expect(oldBalance).equal(amount50);
      const newBalance = (await myTokenContract.balanceOf(acc2)).toString();
      expect(newBalance).equal(amount50);
    })
    it("delegate votes", async () => {
      const votes = (await myTokenContract.getVotes(deployer)).toString();
      expect(votes).equal(amount100);
    })
    it("transfer votes", async () => {
      let votes = (await myTokenContract.getVotes(deployer)).toString();
      expect(votes).equal(amount100);
      await myTokenContract.transfer(acc2, amount50);
      votes = (await myTokenContract.getVotes(deployer)).toString();
      expect(votes).equal(amount50);
    });
    it("past votes", async () => {
      const pastVotes = await myTokenContract.getPastVotes(deployer, await getLastedBlock() - 1);
      expect(pastVotes).equal(amount100);
    });
  })
  describe("tokenized ballot", () => {
    it("all proposals", async () => {
      getProposals().bytes.forEach(async (b, i) => {
        const proposal = await TokenizedBallotContract.proposals(i);
        expect(proposal).to.eq(b);
      })
    })
    describe("testing votes ", async () => {
      it("voting power", async () => {
        const power = await TokenizedBallotContract.votingPower(deployer);
        expect(power).equal(amount100);
      })
      it("vote in one propose", async () => {
        const id = getRandomInt(0, getProposals().bytes.length - 1)
        await TokenizedBallotContract.vote(id, ethers.parseEther("1"));
        const name = await TokenizedBallotContract.winnerName();
        expect(name).to.equal(getProposals().bytes[id]);
      })
      it("multiple votes", async () => {
        await TokenizedBallotContract.vote(3, ethers.parseEther("33"));
        await TokenizedBallotContract.vote(0, ethers.parseEther("33"));
        await TokenizedBallotContract.vote(5, ethers.parseEther("34"));
        const name = await TokenizedBallotContract.winnerName();
        expect(name).to.equal(getProposals().bytes[5])
      })
      it("voting power spent", async () => {
        await TokenizedBallotContract.vote(0, amount50);
        const spent = await TokenizedBallotContract.votingPowerSpent(deployer);
        expect(spent).to.equal(amount50)
      })
      it("vote without token", async () => {
        await expect(
          TokenizedBallotContract.connect(acc2).vote(0, ethers.parseEther("1")))
          .revertedWith("TokenizedBallot: trying to vote with more votes than you have.")
      })
    })

    describe("winner", () => {
      describe("name", () => {
        it("default", async () => {
          const name = await TokenizedBallotContract.winnerName();
          expect(name).to.equal(getProposals().bytes[0]);
        })
        it("after vote", async () => {
          await TokenizedBallotContract.vote(1, amount100);
          const name = await TokenizedBallotContract.winnerName();
          expect(name).to.equal(getProposals().bytes[1]);
        })
      })
      describe("proposals", async () => {
        it("first proposal", async () => {
          await TokenizedBallotContract.vote(0, amount100);
          const [name, voteCount] = await TokenizedBallotContract.proposals(0);
          expect(name).to.equal(getProposals().bytes[0]);
          expect(voteCount).to.equal(amount100);
        })
        it("after vote", async () => {
          await TokenizedBallotContract.vote(1, amount100);
          const [name, voteCount] = await TokenizedBallotContract.proposals(1);
          expect(name).to.equal(getProposals().bytes[1]);
          expect(voteCount).to.equal(amount100);
        })
        it("random proposal", async () => {
          const id = getRandomInt(0, getProposals().bytes.length - 1)
          await TokenizedBallotContract.vote(id, amount100);
          const name = await TokenizedBallotContract.winnerName();
          expect(name).to.equal(getProposals().bytes[id]);
        })
      })
    });
  });
  describe("access control", async () => {
    let minterRole: string;
    beforeEach(async () => {
      minterRole = await myTokenContract.MINTER_ROLE();
    })
    describe("check access", () => {
      it("minter role", async () => {
        expect(await myTokenContract.hasRole(minterRole, deployer)).to.be.true;
      })
      it("admin role", async () => {
        expect(await myTokenContract.hasRole(await myTokenContract.DEFAULT_ADMIN_ROLE(), deployer)).to.be.true;
      })
      it("has no role", async () => {
        expect(await myTokenContract.hasRole(minterRole, acc1)).to.be.false;
      })
    });
    describe("manege roles", async () => {
      it("grant role", async () => {
        await myTokenContract.grantRole(minterRole, acc1);
        expect(await myTokenContract.hasRole(minterRole, deployer)).to.be.true;
        expect(await myTokenContract.hasRole(minterRole, acc1)).to.be.true;
      })
      it("revoke role", async () => {
        await myTokenContract.grantRole(minterRole, acc1);
        expect(await myTokenContract.hasRole(minterRole, acc1)).to.be.true;
        await myTokenContract.revokeRole(minterRole, acc1);
        expect(await myTokenContract.hasRole(minterRole, acc1)).to.be.false;
      })
      it("renounce role", async () => {
        await myTokenContract.grantRole(minterRole, acc1);
        expect(await myTokenContract.hasRole(minterRole, acc1)).to.be.true;
        await myTokenContract.connect(acc1).renounceRole(minterRole, acc1);
        expect(await myTokenContract.hasRole(minterRole, acc1)).to.be.false;
      })
      it("unauthorized renounce", async () => {
        await myTokenContract.grantRole(minterRole, acc1);
        await expect(myTokenContract.renounceRole(minterRole, acc1)).revertedWith("AccessControl: can only renounce roles for self")
      })
    })
  })
});