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
        console.log(time0);

        const timeDeposited = await time.latest();
        await timeIncreaseTo(timeDeposited.add(time.duration.years(1)).subn(1));
        
        let time1 = await time.latest();
        console.log(time1);
     
        await truffleAssert.passes(
            ulyConInst.withdraw({from: accounts[0]})
        )
        
    })
    

   
})