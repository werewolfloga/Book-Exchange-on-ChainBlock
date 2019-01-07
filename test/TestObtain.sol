pragma solidity ^0.5.0;

import "truffle/Assert.sol";   // 引入的断言
import "truffle/DeployedAddresses.sol";  // 用来获取被测试合约的地址
import "../contracts/Obtain.sol";      // 被测试合约

contract TestObtain {
  Obtain obtain = Obtain(DeployedAddresses.Obtain());

  // 获取测试用例
  function testUserCanObtainBook() public {
    uint returnedId = obtain.obtain(8);

    uint expected = 8;
    Assert.equal(returnedId, expected, "Obtain of Book ID 8 should be recorded.");
  }

  // 书本所有者测试用例
  function testGetObtainerAddressByBookId() public {
    // 期望获取者的地址就是本合约地址，因为交易是由测试合约发起交易，
    address expected = this;
    address obtainer = obtain.obtainers(8);
    Assert.equal(obtainer, expected, "Owner of Book ID 8 should be recorded.");
  }

    // 测试所有获取者
  function testGetObtainerAddressByBookIdInArray() public {
  // 获取者的地址就是本合约地址
    address expected = this;
    address[16] memory obtainers = obtain.getObtainers();
    Assert.equal(obtainers[8], expected, "Owner of Book ID 8 should be recorded.");
  }
}
