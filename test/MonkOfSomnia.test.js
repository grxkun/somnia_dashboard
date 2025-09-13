const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MonkOfSomnia", function () {
  let MonkOfSomnia, monk, owner, participant1, participant2;

  beforeEach(async function () {
    [owner, participant1, participant2] = await ethers.getSigners();
    MonkOfSomnia = await ethers.getContractFactory("MonkOfSomnia");
    monk = await MonkOfSomnia.deploy();
    await monk.waitForDeployment();
  });

  describe("Channel Creation", function () {
    it("Should create a channel with initial deposit", async function () {
      const depositAmount = ethers.parseEther("1.0");
      const challengePeriod = 7 * 24 * 60 * 60; // 7 days

      await expect(
        monk.connect(participant1).openChannel(participant2.address, challengePeriod, {
          value: depositAmount
        })
      ).to.emit(monk, "ChannelOpened")
        .withArgs(1, participant1.address, participant2.address, depositAmount, 0, challengePeriod);

      const channel = await monk.getChannel(1);
      expect(channel.participant1).to.equal(participant1.address);
      expect(channel.participant2).to.equal(participant2.address);
      expect(channel.balance1).to.equal(depositAmount);
      expect(channel.balance2).to.equal(0);
      expect(channel.isOpen).to.be.true;
      expect(channel.inDispute).to.be.false;
    });

    it("Should not allow opening channel with invalid parameters", async function () {
      const depositAmount = ethers.parseEther("1.0");
      const invalidChallengePeriod = 1800; // 30 minutes (too short)

      await expect(
        monk.connect(participant1).openChannel(participant2.address, invalidChallengePeriod, {
          value: depositAmount
        })
      ).to.be.revertedWith("Invalid challenge period");

      await expect(
        monk.connect(participant1).openChannel(participant1.address, 7 * 24 * 60 * 60, {
          value: depositAmount
        })
      ).to.be.revertedWith("Cannot open channel with yourself");
    });
  });

  describe("Deposits", function () {
    let channelId;

    beforeEach(async function () {
      const depositAmount = ethers.parseEther("1.0");
      const challengePeriod = 7 * 24 * 60 * 60;
      
      await monk.connect(participant1).openChannel(participant2.address, challengePeriod, {
        value: depositAmount
      });
      channelId = 1;
    });

    it("Should allow participants to deposit additional funds", async function () {
      const additionalDeposit = ethers.parseEther("0.5");

      await expect(
        monk.connect(participant2).deposit(channelId, { value: additionalDeposit })
      ).to.emit(monk, "Deposit")
        .withArgs(channelId, participant2.address, additionalDeposit);

      const channel = await monk.getChannel(channelId);
      expect(channel.balance2).to.equal(additionalDeposit);
    });

    it("Should not allow non-participants to deposit", async function () {
      const depositAmount = ethers.parseEther("0.5");
      const [, , , nonParticipant] = await ethers.getSigners();

      await expect(
        monk.connect(nonParticipant).deposit(channelId, { value: depositAmount })
      ).to.be.revertedWith("Not a channel participant");
    });
  });

  describe("Channel Management", function () {
    let channelId;

    beforeEach(async function () {
      const depositAmount = ethers.parseEther("1.0");
      const challengePeriod = 7 * 24 * 60 * 60;
      
      await monk.connect(participant1).openChannel(participant2.address, challengePeriod, {
        value: depositAmount
      });
      channelId = 1;
    });

    it("Should track user channels correctly", async function () {
      const participant1Channels = await monk.getUserChannels(participant1.address);
      const participant2Channels = await monk.getUserChannels(participant2.address);

      expect(participant1Channels.length).to.equal(1);
      expect(participant2Channels.length).to.equal(1);
      expect(participant1Channels[0]).to.equal(1);
      expect(participant2Channels[0]).to.equal(1);
    });

    it("Should increment channel IDs correctly", async function () {
      const initialNextId = await monk.nextChannelId();
      expect(initialNextId).to.equal(2);

      // Create another channel
      await monk.connect(participant1).openChannel(participant2.address, 7 * 24 * 60 * 60, {
        value: ethers.parseEther("0.5")
      });

      const newNextId = await monk.nextChannelId();
      expect(newNextId).to.equal(3);
    });
  });

  describe("Message Hashing and Signatures", function () {
    it("Should generate consistent message hashes", async function () {
      const channelId = 1;
      const nonce = 5;
      const balance1 = ethers.parseEther("0.7");
      const balance2 = ethers.parseEther("0.3");

      const hash1 = await monk.getMessageHash(channelId, nonce, balance1, balance2);
      const hash2 = await monk.getMessageHash(channelId, nonce, balance1, balance2);

      expect(hash1).to.equal(hash2);
    });

    it("Should generate different hashes for different parameters", async function () {
      const channelId = 1;
      const nonce = 5;
      const balance1 = ethers.parseEther("0.7");
      const balance2 = ethers.parseEther("0.3");

      const hash1 = await monk.getMessageHash(channelId, nonce, balance1, balance2);
      const hash2 = await monk.getMessageHash(channelId, nonce + 1, balance1, balance2);

      expect(hash1).to.not.equal(hash2);
    });
  });
});