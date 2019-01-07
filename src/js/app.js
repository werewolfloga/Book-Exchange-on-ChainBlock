App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
    // Load books.
    $.getJSON('../books.json', function(data) {
      var booksRow = $('#booksRow');
      var bookTemplate = $('#bookTemplate');

      for (i = 0; i < data.length; i ++) {
        bookTemplate.find('.panel-title').text(data[i].name);
        bookTemplate.find('img').attr('src', data[i].picture);
        bookTemplate.find('.book-type').text(data[i].booktype);
        bookTemplate.find('.book-location').text(data[i].location);
        bookTemplate.find('.btn-obtain').attr('data-id', data[i].id);
        booksRow.append(bookTemplate.html());
      }
    });

    return await App.initWeb3();
  },

  initWeb3: function() {
    // Is there an injected web3 instance?
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
    } else {
    // If no injected web3 instance is detected, fall back to Ganache
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    web3 = new Web3(App.web3Provider);
    return App.initContract();
  }

  initContract: function() {
    // 加载Obtain.json，保存了Obtain的ABI（接口说明）信息及部署后的网络(地址)信息，它在编译合约的时候生成ABI，在部署的时候追加网络信息
    $.getJSON('Obtain.json', function(data) {
      // 用Obtain.json数据创建一个可交互的TruffleContract合约实例。
      var ObtainArtifact = data;
      App.contracts.Obtain = TruffleContract(ObtainArtifact);
      // Set the provider for our contract
      App.contracts.Obtain.setProvider(App.web3Provider);
      // Use our contract to retrieve and mark the adopted books
      return App.markAdopted();
    });
    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-adopt', App.handleAdopt);
  },

  markAdopted: function(obtainers, account) {
    var obtainInstance;
    App.contracts.Obtain.deployed().then(function(instance) {
      obtainInstance = instance;
      // 调用合约的getAdopters(), 用call读取信息不用消耗gas
      return obtainInstance.getAdopters.call();
    }).then(function(obtainers) {
      for (i = 0; i < obtainers.length; i++) {
        if (obtainers[i] !== '0x0000000000000000000000000000000000000000') {
          $('.panel-book').eq(i).find('button').text('Success').attr('disabled', true);
        }
      }
    }).catch(function(err) {
      console.log(err.message);
    });
  },

  handleAdopt: function(event) {
    event.preventDefault();
  var bookId = parseInt($(event.target).data('id'));
  var obtainInstance;
  // 获取用户账号
  web3.eth.getAccounts(function(error, accounts) {
    if (error) {
      console.log(error);
    }
    var account = accounts[0];
    App.contracts.Obtain.deployed().then(function(instance) {
      obtainInstance = instance;
      // 发送交易获取书本
      return obtainInstance.adopt(bookId, {from: account});
      }).then(function(result) {
        return App.markAdopted();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
