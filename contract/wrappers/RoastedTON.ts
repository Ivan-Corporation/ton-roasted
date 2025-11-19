import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';

export type roastedTONConfig = {
    id: number;
    counter: number;
    roastCount: number;
    lastRandomSeed: number;
};

export function roastedTONConfigToCell(config: roastedTONConfig): Cell {
    return beginCell()
        .storeUint(config.id, 32)
        .storeUint(config.counter, 32)
        .storeUint(config.roastCount, 32)
        .storeUint(config.lastRandomSeed, 32)
        .endCell();
}

export const Opcodes = {
    OP_INCREASE: 0x7e8764ef,
    OP_RESET: 0x3a752f06,
    OP_GET_ROAST: 0x15f7f5a3,
};

export class RoastedTON implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new RoastedTON(address);
    }

    static createFromConfig(config: roastedTONConfig, code: Cell, workchain = 0) {
        const data = roastedTONConfigToCell(config);
        const init = { code, data };
        return new RoastedTON(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    async sendIncrease(
        provider: ContractProvider,
        via: Sender,
        opts: {
            increaseBy: number;
            value: bigint;
            queryID?: number;
        }
    ) {
        await provider.internal(via, {
            value: opts.value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(Opcodes.OP_INCREASE, 32)
                .storeUint(opts.queryID ?? 0, 64)
                .storeUint(opts.increaseBy, 32)
                .endCell(),
        });
    }

    async sendReset(
        provider: ContractProvider,
        via: Sender,
        opts: {
            value: bigint;
            queryID?: number;
        }
    ) {
        await provider.internal(via, {
            value: opts.value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(Opcodes.OP_RESET, 32)
                .storeUint(opts.queryID ?? 0, 64)
                .endCell(),
        });
    }

    async sendGetRoast(
        provider: ContractProvider,
        via: Sender,
        opts: {
            value: bigint;
            queryID?: number;
        }
    ) {
        await provider.internal(via, {
            value: opts.value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(Opcodes.OP_GET_ROAST, 32)
                .storeUint(opts.queryID ?? 0, 64)
                .endCell(),
        });
    }

    async getCounter(provider: ContractProvider) {
        const result = await provider.get('currentCounter', []);
        return result.stack.readNumber();
    }

    async getID(provider: ContractProvider) {
        const result = await provider.get('initialId', []);
        return result.stack.readNumber();
    }

    async getRoastCount(provider: ContractProvider) {
        const result = await provider.get('getRoastCount', []);
        return result.stack.readNumber();
    }

    async getTotalRoasts(provider: ContractProvider) {
        const result = await provider.get('getTotalRoasts', []);
        return result.stack.readNumber();
    }

    async getRandomRoast(provider: ContractProvider): Promise<string> {
        const result = await provider.get('getRandomRoast', []);
        return result.stack.readString();
    }

    async getRoastByIndex(provider: ContractProvider, index: number): Promise<string> {
        const result = await provider.get('getRoastByIndex', [{ type: 'int', value: BigInt(index) }]);
        return result.stack.readString();
    }
}