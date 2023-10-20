import { describe, it, expect } from 'vitest'
import { mount, config, createLocalVue } from '@vue/test-utils'
import addElemWithDataAppToBody from 'tests/mocks/DataAppElement';
import currencies from '../../../src/mixins/miscellany/currencies.js';
import mockComponent from '../../mocks/component.vue';

addElemWithDataAppToBody();
config.stubs['font-awesome-icon'] = { template: "<div></div> " }

const localVue = createLocalVue()

const wrapperFactory = () => mount(mockComponent, {
  mixins: [currencies],
})

const wrapper = wrapperFactory();

describe('Currencies Mixin', () => {
    it('should save currencies in indexedDb', async () => {
        await wrapper.vm.saveInIndexedDbCurrencies();
    });

    it('should return an object when calling getCurrencies', () => {
        expect(wrapper.vm.getCurrencies()).toBeInstanceOf(Object);
    });

    it('Should return USD currency when calling getPreferredcurrency and preferredCurrency is null', async () => {
        expect(await wrapper.vm.getPreferredCurrency()).toEqual({
            code: "USD",
            decimal_digits: 2,
            name: "US Dollar",
            name_plural: "US dollars",
            rounding: 0,
            symbol: "$",
            symbol_native: "$",
        });
    });

    it('Should return the specified currency when calling getPreferredcurrency and preferredCurrency is not null', async () => {
        await wrapper.vm.setPreferredCurrency({
            code: "DOP",
            decimal_digits: 2,
            name: "Dominican Peso",
            name_plural: "Dominican pesos",
            rounding: 0,
            symbol: "RD$",
            symbol_native: "RD$",
        });
        expect(await wrapper.vm.getPreferredCurrency()).toEqual({
            code: "DOP",
            decimal_digits: 2,
            name: "Dominican Peso",
            name_plural: "Dominican pesos",
            rounding: 0,
            symbol: "RD$",
            symbol_native: "RD$",
        });
    });

    it('Should return an instance of localForage when calling getInstanceDb', () => {
        expect(wrapper.vm.getInstanceDb()).toBeInstanceOf(Object);
    });

    it('Should return true when calling IsPreferredCurrencyNull and preferredCurrency is null', async () => {
        await wrapper.vm.setPreferredCurrency(null);
        expect(await wrapper.vm.IsPreferredCurrencyNull()).toBe(true);
    });
    
    it('Should return false when calling IsPreferredCurrencyNull and preferredCurrency is not null', async () => {
        await wrapper.vm.setPreferredCurrency({
            code: "DOP",
            decimal_digits: 2,
            name: "Dominican Peso",
            name_plural: "Dominican pesos",
            rounding: 0,
            symbol: "RD$",
            symbol_native: "RD$",
        });
        expect(await wrapper.vm.IsPreferredCurrencyNull()).toBe(false);
    });
})