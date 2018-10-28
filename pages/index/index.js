//index.js
//获取应用实例
const app = getApp()

Page({
  data:{
    gameOfWin:0,
    currentPileValue: -1,
    computerArray:[],
    userArray:[],
    pileArray:[]
  },

  onLoad:function() {
    this.initial();
  },

  initial:function() {
    let template = [];
    for (var i = 0; i < 2; i++) {
      for (var j = 0; j < 30; j++) {
        template.push(i * 100 + j);
      }
    }

    template.sort(function () {
      return 0.5 - Math.random();
    });

    let temUser = template.slice(0, 7);
    let temComputer = template.slice(7, 14);
    let temCurrent = template.slice(14, 15);
    for (var j = 0; j < 15; j++) {
      template.shift();
    }

    this.setData({
      currentPileValue: temCurrent,
      pileArray: template,
      userArray: temUser,
      computerArray: temComputer,
    });
  },

  cardClicking:function(e) {
    if (Math.floor(e.currentTarget.dataset.name % 100 / 10) ===
         Math.floor(this.data.currentPileValue % 100 / 10) ||  
        e.currentTarget.dataset.name % 10 === this.data.currentPileValue % 10) {
      var newUserArray = this.removeCard(e.currentTarget.dataset.name, this.data.userArray);
      this.setData({
        userArray: newUserArray,
      });

      if (this.data.userArray.length === 0 ) {
        this.setData({
          gameOfWin: this.data.gameOfWin + 1,
        });
        
        var self = this;
        wx.showModal({
          title: '恭喜',
          content: '您获得了当前游戏的胜利',
          success: function (res) {
            if (res.confirm) {
              self.initial();
            } else {
              self.initial();
            }
          }
        });

      } else {
        this.computerTurn();
      }
    } else {
      wx.showModal({
        title: '提示',
        content: '请选择相同数字或颜色的卡牌',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else {
            console.log('用户点击取消')
          }
        }
      });
    }
  },

  removeCard:function(currentCard, userArray) {
    var index = userArray.indexOf(currentCard);
    var newUserArraray = userArray;
    
    if (index !== -1) {
      newUserArraray.splice(index, 1);
    }

    this.setData({
      currentPileValue: currentCard,
    });

    return newUserArraray;
  },

  addToUser:function() {
    var temUser = this.newCard(this.data.userArray);
    this.setData({
      userArray: temUser,
    });
    this.computerTurn();
  },

  newCard:function(temArray) {
    if (this.data.pileArray.length > 0) {
      temArray.push(this.data.pileArray[0]);
      var temTotal = this.data.pileArray;
      temTotal.shift();

      this.setData({
        pileArray: temTotal,
      });

      return temArray;
    } else {
      wx.showModal({
        title: '牌库空了',
        content: '牌库已经没牌了',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else {
            console.log('用户点击取消')
          }
        }
      });
    }
  },

  computerTurn:function() {
    var availableCard = false;
    var cardAvailable = -1;

    for( var card of this.data.computerArray) {
      if (card % 10 === this.data.currentPileValue || 
        Math.floor(card % 100 / 10) === Math.floor(this.data.currentPileValue % 100 / 10))    {
          cardAvailable = card;
          break;
      }
    }

    if( cardAvailable != -1) {
      var newComputerArray = this.removeCard(cardAvailable, this.data.computerArray);
      this.setData({
        computerArray: newComputerArray,
      });

      var self = this;
      if (this.data.computerArray.length === 0) {
        wx.showModal({
          title: '抱歉',
          content: '电脑获得了当前游戏的胜利',
          success: function (res) {
            if (res.confirm) {
              self.initial();
            } else {
              self.initial();
            }
          }
        });
      }

    } else if (this.data.pileArray.length > 0) {
      var temComputer = this.newCard(this.data.computerArray);
      this.setData({
        computerArray: temComputer,
      });
    }
  }
})
