var web3 = new Web3(Web3.givenProvider);

$(document).ready(function() {
    window.ethereum.enable().then(async function(accounts){
        ulycon = await new web3.eth.Contract(window.abi, "0xA6422b7866376852b1d53e0F5860102b637717ce", {from: accounts[0]});

        showCurrentTimestamp();
        showBalance();
        showVault();

    }); //closes async function 

    
    async function timeTravel(){

    await web3.currentProvider.sendAsync({
        jsonrpc: "2.0",
        method: "evm_mine",
        id: 12345
      }, function(err, result) {
        // this is your callback
      });
    }
   

    $("#btnTimeTravel").click(timeTravel);
    $("#btnDeposit").click(deposit);
    $("#btnSign").click(signContract);
    $("#btnWithdraw").click(withdrawContract);
    $("#btnForceWithdraw").click(forceWithdraw);
    

    async function showCurrentTimestamp(){
        let currentTimestamp = await ulycon.methods.showCurrentTimestamp().call();
        console.log("Current Timestamp: " + currentTimestamp);
    }

    async function withdrawContract(){
        await ulycon.methods.withdraw().send();
        location.reload();

    }
    async function showVault(){
        let userCon = await ulycon.methods.Vaults(ethereum.selectedAddress).call();
        
        let timeLockedAt = userCon.timeLockedAt;
        let dateLocked = new Date(timeLockedAt * 1000);
        let isLocked = userCon.isLocked;
        let lockedAmount = web3.utils.fromWei(userCon.amount);
        let currentTimestamp = await ulycon.methods.showCurrentTimestamp().call();
        let timePassed = currentTimestamp - timeLockedAt;
        let timeTillDeadline = userCon.timeLockedAt - timePassed;
        let lockDuration = userCon.time;

        console.log("Locked at Unix Time: " + timeLockedAt);
        console.log("Contract Sign Date: " + dateLocked);
        console.log("Contract is locked: " + isLocked);
        console.log("ETH locked: " + lockedAmount);
        console.log("Timepassed: " + timePassed);
        console.log("Time till deadline: " + timeTillDeadline);
        console.log("Lock Duration: " + lockDuration);

        if(isLocked == true){
        document.getElementById("isLockedOut").textContent = "Currently Locked: " + isLocked;
        document.getElementById("signedDateOut").textContent = "Contract Sign Date: " + dateLocked; 
        document.getElementById("amountLockedOut").textContent = "Locked ETH: " + lockedAmount;
        document.getElementById("timePassedOut").textContent = "Time Passed: " + timePassed;
        document.getElementById("timeTillDeadlineOut").textContent = "Time left until deadline: " + timeTillDeadline;
        }
        else{
            document.getElementById("isLockedOut").textContent = "You have no signed Contract at the moment!";
        }

        
        

    }
    async function signContract(){
        let lockTime = $("#lockTime").val();
        let newContract = await ulycon.methods.createVault(lockTime).send();
        console.log(newContract);
        location.reload();
    }
    
   async function deposit(){
        let amount = $("#depositAmount").val();
        console.log(amount);
        await ulycon.methods.deposit().send({value: web3.utils.toWei(amount, "ether")});;
        location.reload();
    }

    async function showBalance(){
        let balance = await ulycon.methods.showBalance().call();
        console.log("Current ETH Balance: " + balance);
        document.getElementById("balanceOut").textContent = web3.utils.fromWei(balance);

    }

    async function forceWithdraw(){
        await ulycon.methods.forceWithdraw().send();
        location.reload();
    }

    

}) //closes main.js