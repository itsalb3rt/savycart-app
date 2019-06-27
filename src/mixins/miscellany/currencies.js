import localForage from "localforage";
import currencies from "@/assets/CommonCurrency.json";

export default {
    methods: {
        async saveInIndexedDbCurrencies() {
            await this.getInstanceDb().setItem("curencies", currencies);
        },
        async getCurrencies() {
            return await this.getInstanceDb().getItem('curencies');
        },
        async setPreferredCurrency(currency) {
            await this.getInstanceDb().setItem("preferredCurrency", currency);
        },
        async getPreferredCurrency() {
            if (await this.IsPreferredCurrencyNull()) {
                return {
                    code: "USD",
                    decimal_digits: 2,
                    name: "US Dollar",
                    name_plural: "US dollars",
                    rounding: 0,
                    symbol: "$",
                    symbol_native: "$",
                }
            } else {
                return await this.getInstanceDb().getItem('preferredCurrency');
            }

        },
        getInstanceDb() {
            const db = localForage.createInstance({
                name: "app"
            });
            return db;
        },
        async IsPreferredCurrencyNull() {
            let currentPreferredCurrency = await this.getInstanceDb().getItem('preferredCurrency');
            if (currentPreferredCurrency == null) {
                return true;
            } else {
                return false;
            }
        }
    },
}