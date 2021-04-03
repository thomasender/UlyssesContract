var web3 = new Web3(Web3.givenProvider);

$(document).ready(function() {
    window.ethereum.enable().then(async function(accounts){
        ulycon = await new web3.eth.Contract(window.abi, "0x3F0431B4D908339285A421FEEcEBbeA8601bB022", {from: accounts[0]});

        showCurrentTimestamp();
      //  showBalance();
        showDeposit();
        showVault();

    }); //closes async function 


    $("#btnDeposit").click(deposit);
    $("#btnSign").click(signContract);
    $("#btnWithdraw").click(withdrawContract);
    $("#btnForceWithdraw").click(forceWithdraw);
    $("#btnCalcEndDate").click(calcEndDate);
    
  

    function calcEndDate(){
        let now = Date.now();
     //   console.log(now);
        let lockTime = $("#lockTime").val();
     //   console.log(lockTime);
        let endDate = new Date(now + lockTime * 1000);
        document.getElementById("calcEndDateOut").textContent = endDate;
    }

    async function showCurrentTimestamp(){
        let currentTimestamp = await ulycon.methods.showCurrentTimestamp().call();
     //   console.log("Current Timestamp: " + currentTimestamp);
    }

    async function withdrawContract(){
        await ulycon.methods.withdraw().send();
        location.reload();

    }
    async function showVault(){
        let userCon = await ulycon.methods.Vaults(ethereum.selectedAddress).call();
        
        let timeLockedAt = userCon.timeLockedAt;
  //    console.log("TIMELOCKEDUNIX" + timeLockedAt);
        let dateLocked = new Date(timeLockedAt * 1000);
        let isLocked = userCon.isLocked;
        let lockedAmount = web3.utils.fromWei(userCon.amount);
        let currentTimestamp = await ulycon.methods.showCurrentTimestamp().call();
        let timePassed = currentTimestamp - timeLockedAt;
        let timeTillDeadline = userCon.timeLockedAt - timePassed;
        let lockDuration = userCon.time;
        let endDate = new Date((timeLockedAt * 1000 + lockDuration * 1000));
/*
        console.log("Locked at Unix Time: " + timeLockedAt);
        console.log("Contract Sign Date: " + dateLocked);
        console.log("Contract is locked: " + isLocked);
        console.log("ETH locked: " + lockedAmount);
        console.log("Timepassed: " + timePassed);
        console.log("Time till deadline: " + timeTillDeadline);
        console.log("Lock Duration: " + lockDuration);
*/
        if(isLocked == true){
        document.getElementById("contractTitle").textContent = "Your Ulysses Contract:";
    //   document.getElementById("isLockedOut").textContent = "Currently Locked: " + isLocked;
        document.getElementById("signedDateOut").textContent = "Contract Sign Date: " + dateLocked; 
        document.getElementById("endDateOut").textContent = "Contract End Date: " + endDate; 
        document.getElementById("amountLockedOut").textContent = "Locked ETH: " + lockedAmount;
       // document.getElementById("timePassedOut").textContent = "Time Passed: " + timePassed;
       // document.getElementById("timeTillDeadlineOut").textContent = "Time left until deadline: " + timeTillDeadline;
      
        var countDownDate = endDate;
        //COUNTDOWN TIMER
        // Update the count down every 1 second
        var x = setInterval(function() {
        
          // Get today's date and time
          var now = new Date().getTime();
        
          // Find the distance between now and the count down date
          var distance = endDate - now;
          // console.log("Distance: " + distance);
        
          // Time calculations for days, hours, minutes and seconds
          var days = Math.floor(distance / (1000 * 60 * 60 * 24));
          var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          var seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
          // Display the result in the element with id="demo"
          document.getElementById("countdown").textContent = days + "d " + hours + "h "
          + minutes + "m " + seconds + "s ";
        
          // If the count down is finished, write some text
          if (distance < 0) {
            clearInterval(x);
            document.getElementById("countdown").textContent = "Time expired! Withdraw your ETH with the normal withdraw function!";
          }
        }, 1000);
    }
    else{
        document.getElementById("contractTitle").textContent = "You have no signed Contract at the moment!";
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
//      console.log("Current ETH Balance: " + balance);
        document.getElementById("balanceOut").textContent = web3.utils.fromWei(balance);

    }
    async function showDeposit(){
        let deposit = await ulycon.methods.showBalance().call();
//      console.log("Current ETH Balance: " + balance);
        document.getElementById("depositOut").textContent = "Your Deposit: " + web3.utils.fromWei(deposit) + " ETH";

    }

    async function forceWithdraw(){
        let userCon = await ulycon.methods.Vaults(ethereum.selectedAddress).call();
        let isLocked = userCon.isLocked;
        let contractBalance = await ulycon.methods.showBalance().call();
        if(isLocked == true){
        await ulycon.methods.forceWithdraw().send();
        location.reload();
        }
        else if(contractBalance == 0){
            alert("You do not have any ETH contract balance! Deposit some ETH first!");
        }
        
    }

  

}) //closes main.js