const ulyCon = artifacts.require("UlyssesContract");
const truffleAssert = require('truffle-assertions');
const { time } = require('../node_modules/@openzeppelin/test-helpers');

async function timeIncreaseTo (seconds) {
    const delay = 1000 - new Date().getMilliseconds();
    await new Promise(resolve => setTimeout(resolve, delay));
    await time.increaseTo(seconds);
}

contract("UlyssesContract", accounts => {
    it("should allow user to deposit ETH", async () => {
        let ulyConInst = await ulyCon.deployed();

        await truffleAssert.passes(
            ulyConInst.deposit({value: 1})
        )
    })
    
    it("should allow user to sign Ulysses Contract when deposited ETH", async () => {
        let ulyConInst = await ulyCon.deployed();

        await ulyConInst.deposit({value: 1, from: accounts[0]})
        await truffleAssert.passes(
            ulyConInst.createVault(10)
        )
        console.log("Vault created");
  
    })

    it("should not allow user to sign more than one contract", async () => {
        let ulyConInst = await ulyCon.deployed();

        await truffleAssert.reverts(
            ulyConInst.createVault(10, {from: accounts[0]})
        )
        
    })


    it("should not allow user to sign Ulysses Contract when no ETH deposited ", async () => {
        let ulyConInst = await ulyCon.deployed();

        await truffleAssert.reverts(
            ulyConInst.createVault(10, {from: accounts[1]})
        )
    })

    it("should not allow user to withdraw when time is not up", async () => {
        let ulyConInst = await ulyCon.deployed();

        await truffleAssert.reverts(
            ulyConInst.withdraw({from: accounts[0]})
        )
    })

    it("should allow user to withdraw after time has passed", async () => {
        let ulyConInst = await ulyCon.deployed();

        let time0 = await time.latest();
        console.log("Time Before Time Increase: " + time0);

        const timeDeposited = await time.latest();
        await timeIncreaseTo(timeDeposited.add(time.duration.years(1)).subn(1));

        let time1 = await time.latest();
        console.log("Time After Time Increase: " + time1);
     
        await truffleAssert.passes(
            ulyConInst.withdraw({from: accounts[0]})
        )
        
    })

    it("should allow user to forceWithdraw", async () => {
        let ulyConInst = await ulyCon.deployed();

        await ulyConInst.deposit({value: 1, from: accounts[0]});
        let balanceAfterDeposit = await ulyConInst.balances(accounts[0]);
        console.log("Balance After Deposit: " + balanceAfterDeposit.words);
        await ulyConInst.createVault(30);
        await truffleAssert.passes(
            ulyConInst.forceWithdraw()
        )
        let balanceAfterForceWithdraw = await ulyConInst.balances(accounts[0]);
        console.log("Balance After ForceWithdraw: " + balanceAfterForceWithdraw.words);
        
    })

    it("should not allow user to ForceWithdraw when no ETH deposited", async () => {
        let ulyConInst = await ulyCon.deployed();

        await truffleAssert.reverts(
            ulyConInst.forceWithdraw({from: accounts[2]})
        )
    })

   
})