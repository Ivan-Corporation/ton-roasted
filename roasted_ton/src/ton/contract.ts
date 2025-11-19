import { Address, Cell, beginCell } from '@ton/core';

// Contract address from your deployment
export const ROAST_CONTRACT_ADDRESS = 'EQBHepjXOn0hOuprJj7EUkZMnVaa0LX962HxBWmX08VwW7qb';

// Create the message body for GetRoast method (opcode: 0x15f7f5a3)
export const createRoastTransaction = (queryId: number = 0) => {
  // Create message body with opcode 0x15f7f5a3 for GetRoast
  const body = beginCell()
    .storeUint(0x15f7f5a3, 32) // opcode
    .storeUint(BigInt(queryId), 64) // query_id
    .endCell();
  
  return {
    validUntil: Math.floor(Date.now() / 1000) + 300, // 5 minutes
    messages: [
      {
        address: ROAST_CONTRACT_ADDRESS,
        amount: '50000000', // 0.05 TON for the reply
        payload: body.toBoc().toString('base64'),
      },
    ],
  };
};