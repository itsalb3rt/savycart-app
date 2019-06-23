import localForage from "localforage";
export default {
    mounted() {
        this.db = localForage.createInstance({
            name: "app"
        });
    },
    methods: {
        async addItemToShoppingCar(index) {
            this.actualAvaliableProducts[index].onCar = true;
            if (this.actualAvaliableProducts[index].quantity == undefined) {
                this.actualAvaliableProducts[index].quantity = 1;
            }
            this.shoppingCar.push(this.actualAvaliableProducts[index]);
            await this.db.setItem('shoppingCar', this.shoppingCar);
        },
        async removeItemFromShoppingCar(idProduct) {
            await this.shoppingCar.forEach((item, index) => {
                if (item.id_product == idProduct) {
                    this.shoppingCar.splice(index, 1);
                    return;
                }
            });
            await this.db.setItem('shoppingCar', this.shoppingCar);
        },
        async getShoppingCarItems() {
            return await this.db.getItem('shoppingCar');
        },
        async clearShoppingCar(){
            await this.db.removeItem('shoppingCar');
        }
    },
    data() {
        return {
            db: []
        }
    }
}