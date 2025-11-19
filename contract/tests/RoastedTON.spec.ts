import { Address, toNano } from '@ton/core';
import { RoastedTON } from '../wrappers/RoastedTON';
import { NetworkProvider, sleep } from '@ton/blueprint';

export async function run(provider: NetworkProvider, args: string[]) {
    const ui = provider.ui();
    const address = Address.parse(args.length > 0 ? args[0] : await ui.input('roastedTON address'));

    const roastedTON = provider.open(RoastedTON.createFromAddress(address));

    // Check current stats
    ui.write('=== Roast Machine Status ===');
    const roastCount = await roastedTON.getRoastCount();
    const counter = await roastedTON.getCounter();
    ui.write(`Roasts served: ${roastCount}`);
    ui.write(`Counter: ${counter}`);

    // Preview a random roast
    const previewRoast = await roastedTON.getRandomRoast();
    ui.write(`\nPreview roast: "${previewRoast}"`);

    // Ask user if they want a fresh roast
    const getFresh = await ui.choose('Get a fresh roast?', ['Yes', 'No'], (choice) => choice);
    
    if (getFresh === 'Yes') {
        ui.write('\n🔥 Requesting fresh roast...');
        await roastedTON.sendGetRoast(provider.sender(), {
            value: toNano('0.05'),
            queryID: Date.now()
        });

        // Wait a bit
        await sleep(3000);

        // Check new count
        const newRoastCount = await roastedTON.getRoastCount();
        ui.write(`✅ Roast delivered! Total roasts: ${newRoastCount}`);
    }

    ui.write('\n=== Available Roasts ===');
    for (let i = 0; i < 9; i++) {
        const roast = await roastedTON.getRoastByIndex(i);
        ui.write(`${i + 1}. ${roast}`);
    }
}