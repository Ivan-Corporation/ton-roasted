import { Cell } from "@ton/core";

// TON Center HTTP API helper
const TONCENTER_API = 'https://testnet.toncenter.com/api/v2';

// Function to call contract get methods
const callGetMethod = async (method: string, args: any[] = []) => {
  try {
    const response = await fetch(`${TONCENTER_API}/runGetMethod`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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
// Enhanced stack value parser with debugging
const parseStackString = (stackItem: any[]): string => {
  if (!stackItem || stackItem.length < 2) {
    console.log('Invalid stack item:', stackItem);
    return 'Invalid response from contract';
  }
  
  const [type, value] = stackItem;
  console.log(`Parsing string - type: ${type}, value:`, value);
  
  // Handle different TON stack types
  switch (type) {
    case 'string':
      return value;
      
    case 'int':
    case 'num':
      const index = parseInt(value, 10);
      console.log(`Numeric index received: ${index}`);
      
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
      // For cell types, we need to parse the cell data
      console.log('Cell data received, attempting to parse...');
      try {
        if (value.bytes) {
          // Parse the cell from bytes
          const cell = Cell.fromBoc(Buffer.from(value.bytes, 'base64'))[0];
          console.log('Parsed cell:', cell);
          
          // Try to read as string from the cell
          const slice = cell.beginParse();
          try {
            // Try to read as string (Tact usually stores strings this way)
            const roastText = slice.loadStringTail();
            console.log('Decoded roast from cell:', roastText);
            return roastText;
          } catch (stringError) {
            console.log('Failed to read as string, trying other methods:', stringError);
            
            // Try to read as reference if main cell is empty
            if (cell.refs.length > 0) {
              const refCell = cell.refs[0];
              const refSlice = refCell.beginParse();
              try {
                const roastText = refSlice.loadStringTail();
                console.log('Decoded roast from ref cell:', roastText);
                return roastText;
              } catch (refError) {
                console.log('Failed to read ref cell:', refError);
              }
            }
            
            // If all else fails, return the raw bytes for debugging
            return `Cell data: ${value.bytes.substring(0, 50)}...`;
          }
        } else {
          return "Cell data without bytes field";
        }
      } catch (cellError) {
        console.error('Error parsing cell:', cellError);
        return "Error parsing cell data";
      }
      
    case 'slice':
      console.log('Slice data received:', value);
      return "Roast data in slice format";
      
    case 'null':
      return "No roast available";
      
    default:
      console.log('Unknown stack type:', type, 'value:', value);
      return `Unknown response type: ${type}`;
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
    
    console.log('Raw contract response for getRandomRoast:', result);
    
    if (result.stack && result.stack.length > 0) {
      console.log('Stack items:', result.stack);
      
      // Try different parsing approaches
      const roast = parseStackString(result.stack[0]);
      console.log('Parsed roast:', roast);
      
      return roast;
    }
    return "No roast available from contract";
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

