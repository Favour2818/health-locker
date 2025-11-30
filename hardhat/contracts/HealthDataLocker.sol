// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.24;

import {
    FHE,
    externalEuint32,
    euint32
} from "@fhevm/solidity/lib/FHE.sol";

import { ZamaEthereumConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

contract HealthDataLocker is ZamaEthereumConfig {

    struct Record {
        uint32 dataType;       // e.g. 1 = BP, 2 = Sugar
        uint256 timestamp;     // plaintext
        euint32 value;         // encrypted
        bool isPublic;         // default false
    }

    // Each user’s medical records
    mapping(address => Record[]) private records;

    event RecordAdded(
        address indexed user,
        uint32 dataType,
        uint256 timestamp,
        bytes32 encryptedValue,
        uint256 index
    );

    event RecordMadePublic(
        address indexed user,
        uint256 index,
        bytes32 encryptedValue
    );

    // ==========================
    // 🔹 ADD NEW RECORD
    // ==========================
    function addHealthRecord(
        uint32 dataType,
        uint256 timestamp,
        externalEuint32 valueExt,
        bytes calldata proof
    ) external {
        euint32 value = FHE.fromExternal(valueExt, proof);

        // Allow access to user and contract
        FHE.allowThis(value);
        FHE.allow(value, msg.sender);

        records[msg.sender].push(
            Record({
                dataType: dataType,
                timestamp: timestamp,
                value: value,
                isPublic: false
            })
        );

        uint256 index = records[msg.sender].length - 1;
        emit RecordAdded(msg.sender, dataType, timestamp, FHE.toBytes32(value), index);
    }

    // ==========================
    // 🔓 MAKE RECORD PUBLIC
    // ==========================
    function makeRecordPublic(uint256 index) external {
        require(index < records[msg.sender].length, "Invalid record");

        Record storage rec = records[msg.sender][index];
        require(!rec.isPublic, "Already public");

        rec.value = FHE.makePubliclyDecryptable(rec.value);
        rec.isPublic = true;

        emit RecordMadePublic(msg.sender, index, FHE.toBytes32(rec.value));
    }

    // ==========================
    // 📌 READ RECORD
    // ==========================
    function getEncryptedRecord(address user, uint256 index)
        external
        view
        returns (uint32, uint256, bytes32, bool)
    {
        require(index < records[user].length, "Invalid record");
        Record storage rec = records[user][index];

        return (
            rec.dataType,
            rec.timestamp,
            FHE.toBytes32(rec.value),
            rec.isPublic
        );
    }

    // ==========================
    // 📊 RECORD COUNT
    // ==========================
    function getRecordCount(address user)
        external
        view
        returns (uint256)
    {
        return records[user].length;
    }
}