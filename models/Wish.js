module.exports = function Wish(oldCart) {
  this.items = oldCart.items || {};
  this.totalQty = oldCart.totalQty || 0;
  this.totalPrice = oldCart.totalPrice || 0;

  this.add = function(item, id){
      var storedItem = this.items[id];
   
      if(!storedItem){
      storedItem = this.items[id] = {item: item, qty:0, valorMeeti:0};
      }
      storedItem.qty++;
      storedItem.valorMeeti = storedItem.item.valorMeeti * storedItem.qty;
      this.totalQty++;
      this.totalPrice += storedItem.item.valorMeeti;
  }
  this.generateArray = function(){
      var arr = [];
      for(var id in this.items){
          arr.push(this.items[id]);
      }
      return arr;
  }
};