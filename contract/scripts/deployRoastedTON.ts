import { toNano } from '@ton/core';
import { RoastedTON } from '../wrappers/RoastedTON';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const roastedTON = provider.open(
        RoastedTON.createFromConfig(
            {
                id: Math.floor(Math.random() * 10000),
                counter: 0,
                roastCount: 0,
                lastRandomSeed: 0
            },
            await compile('RoastedTON')
        )
    );

    await roastedTON.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(roastedTON.address);

    console.log('Contract deployed at:', roastedTON.address);
    console.log('Initial ID:', await roastedTON.getID());
    console.log('Roast count:', await roastedTON.getRoastCount());
    console.log('Ready to serve roasts! 🔥');
}