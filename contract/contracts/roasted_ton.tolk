// this struct defines storage layout of the contract
struct Storage {
    id: uint32 // required to allow multiple independent counter instances, since the contract address depends on its initial state
    counter: uint32 // the current counter value
    roastCount: uint32 // track how many times users requested roasts
    lastRandomSeed: uint32 // seed for pseudo-randomness
}

// load contract data from the persistent storage
fun Storage.load() {
    return Storage.fromCell(contract.getData());
}

// save contract data into the persistent storage
fun Storage.save(self) {
    contract.setData(self.toCell());
}

// the struct uses a 32-bit opcode prefix for message identification
struct (0x7e8764ef) IncreaseCounter {
    queryId: uint64 // query id, typically included in messages
    increaseBy: uint32
}

struct (0x3a752f06) ResetCounter {
    queryId: uint64
}

struct (0x15f7f5a3) GetRoast {
    queryId: uint64
}

// using unions to represent available messages
// this allows processing them with pattern matching
type AllowedMessage = IncreaseCounter | ResetCounter | GetRoast

// Simple pseudo-random number generator
fun getRandomIndex(mutate storage: Storage, queryId: uint64): int {
    random.initialize(); // Uses logical time for entropy
    return random.range(9); // Returns 0-8
}

// Helper function to get roast phrase by index
fun getRoastPhrase(index: int) {
    if (index == 0) {
        return "You're the reason we need warning labels.";
    }
    if (index == 1) {
        return "You bring everyone so much joy... when you leave the room.";
    }
    if (index == 2) {
        return "You're like a cloud. When you disappear, it's a beautiful day.";
    }
    if (index == 3) {
        return "If laughter is the best medicine, your face must be curing the world.";
    }
    if (index == 4) {
        return "You have a face for radio... and a voice for silent film.";
    }
    if (index == 5) {
        return "Is your ass jealous of the amount of shit that just came out of your mouth?";
    }
    if (index == 6) {
        return "You're not stupid; you just have bad luck thinking.";
    }
    if (index == 7) {
        return "I'd agree with you but then we'd both be wrong.";
    }
    if (index == 8) {
        return "Don't worry about me. Worry about your eyebrows.";
    }
    return "You're... actually not that bad. Just kidding!";
}

// the main entrypoint: called when a contract receives an message from other contracts
fun onInternalMessage(in: InMessage) {
    val msg = lazy AllowedMessage.fromSlice(in.body);

    match (msg) {
        IncreaseCounter => {
            var storage = lazy Storage.load();
            storage.counter += msg.increaseBy;
            storage.save();
        }
        ResetCounter => {
            var storage = lazy Storage.load();
            storage.counter = 0;
            storage.save();
        }
        GetRoast => {
            var storage = lazy Storage.load();
            storage.roastCount += 1;
            val randomIndex = getRandomIndex(mutate storage, msg.queryId);
            val roast = getRoastPhrase(randomIndex);
            storage.save();

            val reply = createMessage({
                bounce: BounceMode.NoBounce,
                dest: in.senderAddress,
                value: ton("0.05"),
                body: roast,
            });
            reply.send(SEND_MODE_REGULAR);
        }
        else => {
            assert (in.body.isEmpty()) throw 0xFFFF;
        }
    }
}

// a handler for bounced messages (not used here, may be ommited)
fun onBouncedMessage(in: InMessageBounced) {}

// get methods are a means to conveniently read contract data using, for example, HTTP APIs
// note that unlike in many other smart contract VMs, get methods cannot be called by other contracts
get fun currentCounter(): int {
    val storage = lazy Storage.load();
    return storage.counter;
}

get fun initialId(): int {
    val storage = lazy Storage.load();
    return storage.id;
}

get fun getRandomRoast() {
    val storage = lazy Storage.load();
    val simpleIndex = (storage.roastCount % 9);
    return getRoastPhrase(simpleIndex);
}

get fun getRoastCount(): int {
    val storage = lazy Storage.load();
    return storage.roastCount;
}

get fun getTotalRoasts(): int {
    val storage = lazy Storage.load();
    return storage.roastCount;
}

get fun getRoastByIndex(index: int) {
    return getRoastPhrase(index);
}
