import localForage from "localforage";

export default {
    methods: {
        async saveInIndexedDbItbis(itbis) {
            await this.getInstanceDb().setItem("itbis", itbis);
        },
        async getItbisFromIndexedDb() {
            let itbis = await this.getInstanceDb().getItem('itbis');
            return (itbis == null)? 1 : itbis;
        },
        getInstanceDb() {
            const db = localForage.createInstance({
                name: "app"
            });
            return db;
        },
    },
}