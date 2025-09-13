// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MonkOfSomnia
 * @dev Payment channel contract for Somnia Network
 * @notice Implements bidirectional payment channels with dispute resolution
 */
contract MonkOfSomnia is ReentrancyGuard, Ownable {
    
    struct Channel {
        address participant1;
        address participant2;
        uint256 balance1;
        uint256 balance2;
        uint256 nonce;
        uint256 challengePeriod;
        uint256 challengeEnd;
        bool isOpen;
        bool inDispute;
        address challenger;
    }
    
    struct PaymentProof {
        uint256 channelId;
        uint256 nonce;
        uint256 amount1;
        uint256 amount2;
        bytes signature1;
        bytes signature2;
    }
    
    mapping(uint256 => Channel) public channels;
    mapping(address => uint256[]) public userChannels;
    
    uint256 public nextChannelId = 1;
    uint256 public constant DEFAULT_CHALLENGE_PERIOD = 7 days;
    uint256 public constant MIN_CHALLENGE_PERIOD = 1 hours;
    uint256 public constant MAX_CHALLENGE_PERIOD = 30 days;
    
    event ChannelOpened(
        uint256 indexed channelId,
        address indexed participant1,
        address indexed participant2,
        uint256 amount1,
        uint256 amount2,
        uint256 challengePeriod
    );
    
    event ChannelClosed(
        uint256 indexed channelId,
        uint256 finalBalance1,
        uint256 finalBalance2
    );
    
    event DisputeStarted(
        uint256 indexed channelId,
        address indexed challenger,
        uint256 challengeEnd
    );
    
    event DisputeSettled(
        uint256 indexed channelId,
        uint256 finalBalance1,
        uint256 finalBalance2
    );
    
    event Deposit(
        uint256 indexed channelId,
        address indexed participant,
        uint256 amount
    );
    
    event Withdraw(
        uint256 indexed channelId,
        address indexed participant,
        uint256 amount
    );
    
    modifier onlyChannelParticipant(uint256 channelId) {
        require(
            msg.sender == channels[channelId].participant1 || 
            msg.sender == channels[channelId].participant2,
            "Not a channel participant"
        );
        _;
    }
    
    modifier channelExists(uint256 channelId) {
        require(channels[channelId].participant1 != address(0), "Channel does not exist");
        _;
    }
    
    modifier channelOpen(uint256 channelId) {
        require(channels[channelId].isOpen, "Channel is not open");
        _;
    }
    
    constructor() {}
    
    /**
     * @dev Open a new payment channel
     * @param participant2 The other participant in the channel
     * @param challengePeriod Time period for dispute resolution
     */
    function openChannel(
        address participant2,
        uint256 challengePeriod
    ) external payable nonReentrant {
        require(participant2 != address(0), "Invalid participant address");
        require(participant2 != msg.sender, "Cannot open channel with yourself");
        require(msg.value > 0, "Must deposit some funds");
        require(
            challengePeriod >= MIN_CHALLENGE_PERIOD && 
            challengePeriod <= MAX_CHALLENGE_PERIOD,
            "Invalid challenge period"
        );
        
        uint256 channelId = nextChannelId++;
        
        channels[channelId] = Channel({
            participant1: msg.sender,
            participant2: participant2,
            balance1: msg.value,
            balance2: 0,
            nonce: 0,
            challengePeriod: challengePeriod,
            challengeEnd: 0,
            isOpen: true,
            inDispute: false,
            challenger: address(0)
        });
        
        userChannels[msg.sender].push(channelId);
        userChannels[participant2].push(channelId);
        
        emit ChannelOpened(channelId, msg.sender, participant2, msg.value, 0, challengePeriod);
    }
    
    /**
     * @dev Deposit funds into an existing channel
     * @param channelId The channel to deposit into
     */
    function deposit(uint256 channelId) 
        external 
        payable 
        nonReentrant 
        channelExists(channelId) 
        channelOpen(channelId)
        onlyChannelParticipant(channelId) 
    {
        require(msg.value > 0, "Must deposit some funds");
        require(!channels[channelId].inDispute, "Channel is in dispute");
        
        Channel storage channel = channels[channelId];
        
        if (msg.sender == channel.participant1) {
            channel.balance1 += msg.value;
        } else {
            channel.balance2 += msg.value;
        }
        
        emit Deposit(channelId, msg.sender, msg.value);
    }
    
    /**
     * @dev Close a channel cooperatively with final balances
     * @param channelId The channel to close
     * @param finalBalance1 Final balance for participant1
     * @param finalBalance2 Final balance for participant2
     * @param nonce The latest nonce
     * @param signature1 Signature from participant1
     * @param signature2 Signature from participant2
     */
    function closeChannel(
        uint256 channelId,
        uint256 finalBalance1,
        uint256 finalBalance2,
        uint256 nonce,
        bytes memory signature1,
        bytes memory signature2
    ) external nonReentrant channelExists(channelId) channelOpen(channelId) onlyChannelParticipant(channelId) {
        Channel storage channel = channels[channelId];
        require(!channel.inDispute, "Channel is in dispute");
        require(nonce >= channel.nonce, "Invalid nonce");
        
        uint256 totalBalance = channel.balance1 + channel.balance2;
        require(finalBalance1 + finalBalance2 <= totalBalance, "Balances exceed total");
        
        // Verify signatures
        bytes32 messageHash = getMessageHash(channelId, nonce, finalBalance1, finalBalance2);
        require(
            verifySignature(messageHash, signature1, channel.participant1) &&
            verifySignature(messageHash, signature2, channel.participant2),
            "Invalid signatures"
        );
        
        channel.isOpen = false;
        
        // Transfer funds
        if (finalBalance1 > 0) {
            payable(channel.participant1).transfer(finalBalance1);
        }
        if (finalBalance2 > 0) {
            payable(channel.participant2).transfer(finalBalance2);
        }
        
        emit ChannelClosed(channelId, finalBalance1, finalBalance2);
    }
    
    /**
     * @dev Start a dispute for uncooperative closing
     * @param channelId The channel in dispute
     * @param nonce The nonce of the latest state
     * @param balance1 Balance for participant1
     * @param balance2 Balance for participant2
     * @param signature Signature from the other participant
     */
    function startDispute(
        uint256 channelId,
        uint256 nonce,
        uint256 balance1,
        uint256 balance2,
        bytes memory signature
    ) external channelExists(channelId) channelOpen(channelId) onlyChannelParticipant(channelId) {
        Channel storage channel = channels[channelId];
        require(!channel.inDispute, "Dispute already started");
        require(nonce >= channel.nonce, "Invalid nonce");
        
        uint256 totalBalance = channel.balance1 + channel.balance2;
        require(balance1 + balance2 <= totalBalance, "Balances exceed total");
        
        // Determine the other participant
        address otherParticipant = (msg.sender == channel.participant1) 
            ? channel.participant2 
            : channel.participant1;
        
        // Verify signature from other participant
        bytes32 messageHash = getMessageHash(channelId, nonce, balance1, balance2);
        require(
            verifySignature(messageHash, signature, otherParticipant),
            "Invalid signature"
        );
        
        channel.inDispute = true;
        channel.challenger = msg.sender;
        channel.challengeEnd = block.timestamp + channel.challengePeriod;
        channel.nonce = nonce;
        channel.balance1 = balance1;
        channel.balance2 = balance2;
        
        emit DisputeStarted(channelId, msg.sender, channel.challengeEnd);
    }
    
    /**
     * @dev Settle a dispute after challenge period
     * @param channelId The channel to settle
     */
    function settleDispute(uint256 channelId) 
        external 
        nonReentrant 
        channelExists(channelId) 
        channelOpen(channelId) 
    {
        Channel storage channel = channels[channelId];
        require(channel.inDispute, "No dispute to settle");
        require(block.timestamp >= channel.challengeEnd, "Challenge period not ended");
        
        channel.isOpen = false;
        channel.inDispute = false;
        
        // Transfer final balances
        if (channel.balance1 > 0) {
            payable(channel.participant1).transfer(channel.balance1);
        }
        if (channel.balance2 > 0) {
            payable(channel.participant2).transfer(channel.balance2);
        }
        
        emit DisputeSettled(channelId, channel.balance1, channel.balance2);
    }
    
    /**
     * @dev Withdraw funds from a closed channel (if any remaining)
     * @param channelId The channel to withdraw from
     */
    function withdraw(uint256 channelId) 
        external 
        nonReentrant 
        channelExists(channelId) 
        onlyChannelParticipant(channelId) 
    {
        Channel storage channel = channels[channelId];
        require(!channel.isOpen, "Channel is still open");
        require(!channel.inDispute, "Channel is in dispute");
        
        uint256 amount;
        if (msg.sender == channel.participant1 && channel.balance1 > 0) {
            amount = channel.balance1;
            channel.balance1 = 0;
        } else if (msg.sender == channel.participant2 && channel.balance2 > 0) {
            amount = channel.balance2;
            channel.balance2 = 0;
        }
        
        require(amount > 0, "No funds to withdraw");
        
        payable(msg.sender).transfer(amount);
        emit Withdraw(channelId, msg.sender, amount);
    }
    
    /**
     * @dev Get channels for a user
     * @param user The user address
     * @return Array of channel IDs
     */
    function getUserChannels(address user) external view returns (uint256[] memory) {
        return userChannels[user];
    }
    
    /**
     * @dev Get channel information
     * @param channelId The channel ID
     * @return Channel struct
     */
    function getChannel(uint256 channelId) external view returns (Channel memory) {
        return channels[channelId];
    }
    
    /**
     * @dev Generate message hash for signatures
     */
    function getMessageHash(
        uint256 channelId,
        uint256 nonce,
        uint256 balance1,
        uint256 balance2
    ) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(channelId, nonce, balance1, balance2));
    }
    
    /**
     * @dev Verify signature
     */
    function verifySignature(
        bytes32 messageHash,
        bytes memory signature,
        address signer
    ) public pure returns (bool) {
        bytes32 ethSignedMessageHash = keccak256(
            abi.encodePacked("\x19Ethereum Signed Message:\n32", messageHash)
        );
        
        bytes32 r;
        bytes32 s;
        uint8 v;
        
        if (signature.length != 65) {
            return false;
        }
        
        assembly {
            r := mload(add(signature, 32))
            s := mload(add(signature, 64))
            v := byte(0, mload(add(signature, 96)))
        }
        
        return ecrecover(ethSignedMessageHash, v, r, s) == signer;
    }
}