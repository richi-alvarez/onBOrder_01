module.exports = function Cart(oldCart) {
    this.items = oldCart.items || {};
    this.totalQty = oldCart.totalQty || 0;
    this.totalPrice = oldCart.totalPrice || 0;
    this.totalTax = oldCart.totalTax || 0;

    this.add = function(item, id){
        var storedItem = this.items[id];
        if(!storedItem){
        storedItem = this.items[id] = {item: item, qty:0, descuento:0, iva:0};
        }
        storedItem.qty++;
        storedItem.descuento = storedItem.item.descuento * storedItem.qty;
        storedItem.iva = storedItem.item.iva * storedItem.qty;
        this.totalQty++;
        this.totalPrice += storedItem.item.descuento;
        this.totalTax += storedItem.item.iva;
    };

    this.reduceByOne = function(id){
       this.items[id].qty--;
       this.items[id].descuento -= this.items[id].item.descuento;
        this.totalQty--;
        this.totalPrice -= this.items[id].item.descuento;
        if(this.items[id].qty <= 0){
            delete this.items[id];
        }
    };

    this.removeItem = function(id){
        this.totalQty -= this.items[id].qty;
        this.totalPrice -= this.items[id].descuento;
        delete this.items[id];
    }

    this.generateArray = function(){
        var arr = [];
        for(var id in this.items){
            arr.push(this.items[id]);
        }
        return arr;
    }
};