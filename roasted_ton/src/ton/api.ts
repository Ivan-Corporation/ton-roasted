import { Cell } from "@ton/core";

// TON Center HTTP API helper
const TONCENTER_API = 'https://testnet.toncenter.com/api/v2';
const API_KEY = '62314637f463b355ebc7d20a0ee2434913dc946206cc0e0fa98b42b8c083a6b9';

// Function to call contract get methods
const callGetMethod = async (method: string, args: any[] = []) => {
  try {
    const response = await fetch(`${TONCENTER_API}/runGetMethod`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY,
      },
      body: JSON.stringify({
        address: 'EQBHepjXOn0hOuprJj7EUkZMnVaa0LX962HxBWmX08VwW7qb',
        method: method,
        stack: args
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.ok) {
      throw new Error(`API error: ${data.error}`);
    }

    return data.result;
  } catch (error) {
    console.error(`Error calling ${method}:`, error);
    throw error;
  }
};

// Parse stack value to number
const parseStackNumber = (stackItem: any[]): number => {
  if (!stackItem || stackItem.length < 2) return 0;
  
  const [type, value] = stackItem;
  if (type === 'int') {
    return parseInt(value, 10);
  } else if (type === 'num') {
    return Number(value);
  }
  return 0;
};

// Parse stack value to string
const parseStackString = (stackItem: any[]): string => {
  if (!stackItem || stackItem.length < 2) {
    return 'Invalid response from contract';
  }
  
  const [type, value] = stackItem;
  
  // Handle different TON stack types
  switch (type) {
    case 'string':
      return value;
      
    case 'int':
    case 'num':
      const index = parseInt(value, 10);
      const roasts = [
        "You're the reason we need warning labels.",
        "You bring everyone so much joy... when you leave the room.",
        "You're like a cloud. When you disappear, it's a beautiful day.",
        "If laughter is the best medicine, your face must be curing the world.",
        "You have a face for radio... and a voice for silent film.",
        "Is your ass jealous of the amount of shit that just came out of your mouth?",
        "You're not stupid; you just have bad luck thinking.",
        "I'd agree with you but then we'd both be wrong.",
        "Don't worry about me. Worry about your eyebrows.",
        "You're... actually not that bad. Just kidding!"
      ];
      
      if (index >= 0 && index < roasts.length) {
        return roasts[index];
      } else {
        return `Roast index ${index} out of range`;
      }
      
    case 'cell':
      // For cell types, parse the cell data
      try {
        if (value.bytes) {
          const cell = Cell.fromBoc(Buffer.from(value.bytes, 'base64'))[0];
          const slice = cell.beginParse();
          
          // Try to read as string from the cell
          try {
            const roastText = slice.loadStringTail();
            return roastText;
          } catch (stringError) {
            // Try to read from reference cells if main cell is empty
            if (cell.refs.length > 0) {
              const refCell = cell.refs[0];
              const refSlice = refCell.beginParse();
              try {
                const roastText = refSlice.loadStringTail();
                return roastText;
              } catch (refError) {
                // If all else fails, return generic message
                return "Error reading roast data";
              }
            }
            return "Error reading roast data";
          }
        } else {
          return "Invalid cell data";
        }
      } catch (cellError) {
        console.error('Error parsing cell:', cellError);
        return "Error parsing cell data";
      }
      
    case 'null':
      return "No roast available";
      
    default:
      return "Unknown response type from contract";
  }
};

// Function to get roast count from contract
export const getRoastCount = async (): Promise<number> => {
  try {
    const result = await callGetMethod('getRoastCount');
    
    if (result.stack && result.stack.length > 0) {
      return parseStackNumber(result.stack[0]);
    }
    return 0;
  } catch (error) {
    console.error('Error getting roast count:', error);
    return 0;
  }
};

// Function to get a random roast from contract
export const getRandomRoast = async (): Promise<string> => {
  try {
    const result = await callGetMethod('getRandomRoast');
    
    if (result.stack && result.stack.length > 0) {
      return parseStackString(result.stack[0]);
    }
    return "No roast available";
  } catch (error) {
    console.error('Error getting random roast:', error);
    return "Failed to get roast from contract";
  }
};

// Function to get roast by index
export const getRoastByIndex = async (index: number): Promise<string> => {
  try {
    const result = await callGetMethod('getRoastByIndex', [
      ['num', index.toString()]
    ]);
    
    if (result.stack && result.stack.length > 0) {
      return parseStackString(result.stack[0]);
    }
    return "Invalid roast index";
  } catch (error) {
    console.error('Error getting roast by index:', error);
    return "Failed to get roast from contract";
  }
};

// Function to get initial ID
export const getInitialId = async (): Promise<number> => {
  try {
    const result = await callGetMethod('initialId');
    
    if (result.stack && result.stack.length > 0) {
      return parseStackNumber(result.stack[0]);
    }
    return 0;
  } catch (error) {
    console.error('Error getting initial ID:', error);
    return 0;
  }
};