const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("HealthDataLocker", function () {
let Contract, contract, owner, doctor, addr2;

before(async () => {
[owner, doctor, addr2] = await ethers.getSigners();
Contract = await ethers.getContractFactory("HealthDataLocker");
contract = await Contract.deploy(); // No .deployed() in Hardhat v6
console.log("📦 Contract deployed to:", contract.target);
});

it("Should add a multi-value encrypted health record", async () => {
// Simulate encrypted inputs & proofs (dummy data)
const dataTypes = [1, 2, 3, 4]; // e.g. BP, Sugar, HR, Temp
const timestamp = Math.floor(Date.now() / 1000);

// Dummy 32-byte ciphertexts
const encryptedInputs = Array(dataTypes.length).fill("0x" + "11".repeat(32));
const proofs = Array(dataTypes.length).fill("0x" + "22".repeat(32));

await expect(
contract.addHealthRecord(dataTypes, timestamp, encryptedInputs, proofs)
).to.emit(contract, "RecordAdded");
});

it("Should correctly count health records", async () => {
const count = await contract.getRecordCount(owner.address);
expect(count).to.equal(1);
});

it("Should retrieve encrypted health record", async () => {
const [types, timestamp, encryptedValues, isPublic] =
await contract.getEncryptedRecord(owner.address, 0);

expect(types.length).to.equal(4);
expect(encryptedValues[0]).to.match(/^0x/);
expect(isPublic).to.be.false;
});

it("Should make record public", async () => {
await expect(contract.makeRecordPublic(0)).to.emit(contract, "RecordMadePublic");

const [ , , , isPublic ] = await contract.getEncryptedRecord(owner.address, 0);
expect(isPublic).to.be.true;
});

it("Should allow doctor access to record", async () => {
await expect(contract.grantRecordViewer(0, doctor.address))
.to.emit(contract, "RecordViewerGranted");

const canDoctorView = await contract.canViewRecord(owner.address, 0, doctor.address);
expect(canDoctorView).to.be.true;
});

it("Should deny access to random user", async () => {
const canRandomView = await contract.canViewRecord(owner.address, 0, addr2.address);
expect(canRandomView).to.be.false;
});
});