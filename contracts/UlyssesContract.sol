pragma solidity ^0.8.0;

contract UlyssesContract{
    
    address owner;
    
    constructor() public {
        owner = msg.sender;
    }

    struct Locker {
        address User;
        uint amount;
        bool isLocked;
        uint timeLockedAt;
        uint time;
    } 

    mapping (address => uint) public balances;
    mapping (address => Locker) public Vaults;
    
    
    function showCurrentTimestamp() public returns(uint){
        return block.timestamp;
    }
    function forceWithdraw() public payable {
        require(Vaults[msg.sender].isLocked = true, "Your ETH is not locked, use normal withdraw instead!");
        uint toTransfer = balances[msg.sender] / 100 * 75;
        uint donation = balances[msg.sender] / 100 * 25;
        balances[msg.sender] = 0;
        Vaults[msg.sender].amount = 0;
        Vaults[msg.sender].isLocked = false;
        Vaults[msg.sender].time = 0;
        Vaults[msg.sender].timeLockedAt = 0;
        payable(msg.sender).transfer(toTransfer);
        payable(owner).transfer(donation);
    }
    

    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }


    function createVault(uint _timeToLock) public {
        require(balances[msg.sender] > 0, "Insufficient balance to sign Ulysses Contract! Deposit ETH first!");
        require(Vaults[msg.sender].isLocked == false, "You still have a signed contract!");
        Vaults[msg.sender].User = msg.sender;
        Vaults[msg.sender].amount = balances[msg.sender];
        Vaults[msg.sender].isLocked = true;
        Vaults[msg.sender].timeLockedAt = block.timestamp;
        Vaults[msg.sender].time = _timeToLock;
    }
    
    function showVault() public returns(address, uint, bool, uint, uint, uint){
        
        if(block.timestamp > Vaults[msg.sender].timeLockedAt + Vaults[msg.sender].time){
            Vaults[msg.sender].isLocked = false;
        }
                   uint timeLeft = Vaults[msg.sender].timeLockedAt + Vaults[msg.sender].time - block.timestamp;
       return (Vaults[msg.sender].User, Vaults[msg.sender].amount, Vaults[msg.sender].isLocked, Vaults[msg.sender].timeLockedAt, Vaults[msg.sender].time, timeLeft);
    }
    
    function withdraw() public payable {
        require(Vaults[msg.sender].isLocked == false, "Your vault is still locked!");
        require(balances[msg.sender] != 0, "You do not have any funds in this contract!");
        
        uint toTransfer = Vaults[msg.sender].amount;
        balances[msg.sender] -= toTransfer;
        payable(msg.sender).transfer(toTransfer);
        
    }
    
    function showBalance() public view returns(uint){
        return balances[msg.sender];
    }
}