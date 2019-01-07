pragma solidity ^0.5.0;

contract Obtain {

  address[16] public obtainer;  // 保存获取者的地址

    // 获取书本
  function obtain(uint bookId) public returns (uint) {
    require(bookId >= 0 && bookId <= 15);  // 确保id在数组长度内

    obtainer[bookId] = msg.sender;        // 保存调用这地址 
    return bookId;
  }

  // 返回获取者
  function getObtainer() public view returns (address[16] memory) {
    return obtainer;
  }

}