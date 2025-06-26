import axios from 'axios';

// Your server endpoint
const SERVER_URL = 'https://loadpulse.onrender.com/send';

const cities = [
    { origin: ['Boston', 'MA'], dest: ['Buffalo', 'NY'] },
    { origin: ['Minneapolis', 'MN'], dest: ['Des Moines', 'IA'] },
    { origin: ['Phoenix', 'AZ'], dest: ['Albuquerque', 'NM'] },
    { origin: ['Nashville', 'TN'], dest: ['Birmingham', 'AL'] },
    { origin: ['Tampa', 'FL'], dest: ['Savannah', 'GA'] },
    { origin: ['Indianapolis', 'IN'], dest: ['Columbus', 'OH'] },
    { origin: ['Raleigh', 'NC'], dest: ['Richmond', 'VA'] },
    { origin: ['Milwaukee', 'WI'], dest: ['Lincoln', 'NE'] },
    { origin: ['Denver', 'CO'], dest: ['El Paso', 'TX'] },
    { origin: ['Spokane', 'WA'], dest: ['Boise', 'ID'] }
];

let counter = 1;

function randomWeight() {
    return `${18000 + Math.floor(Math.random() * 7000)} lbs`;
}

function randomBid() {
    return Math.random() < 0.5 ? 'NO_BID' : 'BID';
}

function generateMessage() {
    const idx = Math.floor(Math.random() * cities.length);
    const [originCity, originState] = cities[idx].origin;
    const [destinationCity, destinationState] = cities[idx].dest;

    const type = randomBid();
    const isBid = type === 'BID';
    const curCount = counter++;
    const message = {
        channel_id: 1,
        load_id: `LD${50000 + curCount}`,
        account_name: `JB Hunt`,
        origin_city: originCity,
        origin_state: originState,
        origin_country: 'USA',
        destination_city: destinationCity,
        destination_state: destinationState,
        destination_country: 'USA',
        pickup_date: '2025-06-25',
        delivery_date: '2025-06-26',
        weight: randomWeight(),
        make_bid: isBid ? "true" : "false",
        bid_price: isBid ? 1200 + Math.floor(Math.random() * 500) : null,
        timestamp: new Date().toISOString()
    };

    return {
        channel: 1,
        content: message
    };
}

async function sendMessage() {
    const data = generateMessage();
    try {
        const res = await axios.post(SERVER_URL, data);
        console.log('✅ Sent: Load ID:', data.content.load_id);
    } catch (err) {
        console.error('❌ Error sending:', err.message);
    }
}

setInterval(sendMessage, 1000);
