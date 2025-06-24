import axios from 'axios';

// Your server endpoint
const SERVER_URL = 'https://loadpulse.onrender.com/send';

const cities = [
    { origin: ['Houston', 'TX'], dest: ['Atlanta', 'GA'] },
    { origin: ['Miami', 'FL'], dest: ['Charlotte', 'NC'] },
    { origin: ['Cleveland', 'OH'], dest: ['Detroit', 'MI'] },
    { origin: ['San Diego', 'CA'], dest: ['Las Vegas', 'NV'] },
    { origin: ['Kansas City', 'MO'], dest: ['Omaha', 'NE'] }
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

    const message = {
        id: `msg-${counter++}`,
        channel_id: 'load-bot',
        load_id: `LD${50000 + counter}`,
        account_name: `Bot Freight ${counter}`,
        origin_city: originCity,
        origin_state: originState,
        origin_country: 'USA',
        destination_city: destinationCity,
        destination_state: destinationState,
        destination_country: 'USA',
        pickup_date: '2025-06-25',
        delivery_date: '2025-06-26',
        weight: randomWeight(),
        make_bid: isBid ? 1 : 0,
        bid_price: isBid ? 1200 + Math.floor(Math.random() * 500) : null,
        type,
        title: `${type} - ${originState} to ${destinationState}`,
        timestamp: new Date().toISOString()
    };

    return {
        channel: 'load-bot',
        content: message
    };
}

async function sendMessage() {
    const data = generateMessage();
    try {
        const res = await axios.post(SERVER_URL, data);
        console.log('✅ Sent:', data.content.id, '-', data.content.title);
    } catch (err) {
        console.error('❌ Error sending:', err.message);
    }
}

// Send every 5 seconds
setInterval(sendMessage, 500);
