function MessageDetails({ message }) {
    const {
        title,
        type,
        load_id: loadId,
        account_name: accountName,
        origin_city: originCity,
        origin_state: originState,
        origin_country: originCountry,
        destination_city: destinationCity,
        destination_state: destinationState,
        destination_country: destinationCountry,
        pickup_date: pickupDate,
        delivery_date: deliveryDate,
        weight,
        bid_price: bidPrice,
        make_bid: makeBid,
        timestamp,
    } = message;

    const typeStyles = {
        BID: "bg-green-100 text-green-800",
        NO_BID: "bg-red-100 text-red-800",
        INFO: "bg-blue-100 text-blue-800",
    };

    return (
        <div className="max-w-3xl mx-auto bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 space-y-4 border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-1">Load Id: {loadId}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(timestamp).toLocaleString()}
                    </p>
                </div>
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${typeStyles[type]}`}>
                    {type}
                </span>
            </div>

            <div className="text-sm space-y-2">
                <div>
                    <span className="font-semibold">Account:</span> {accountName}
                </div>
                <div>
                    <span className="font-semibold">Origin:</span>{" "}
                    {originCity}, {originState}, {originCountry}
                </div>
                <div>
                    <span className="font-semibold">Destination:</span>{" "}
                    {destinationCity}, {destinationState}, {destinationCountry}
                </div>
                <div>
                    <span className="font-semibold">Pickup Date:</span> {pickupDate}
                </div>
                <div>
                    <span className="font-semibold">Delivery Date:</span> {deliveryDate}
                </div>
                <div>
                    <span className="font-semibold">Weight:</span> {weight}
                </div>
                <div>
                    <span className="font-semibold">Bid Price:</span>{" "}
                    {makeBid ? bidPrice : "N/A"}
                </div>
            </div >
        </div >
    );
}

export default MessageDetails;
