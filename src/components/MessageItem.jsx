function MessageItem({ message, onClick }) {
    const getColor = (type) => {
        switch (type) {
            case "BID": return "text-green-600";
            case "NO_BID": return "text-red-500";
            case "INFO": return "text-blue-500";
            default: return "text-gray-700";
        }
    };

    return (
        <div
            className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-md transition"
            onClick={onClick}
        >
            <div className={`font-medium ${getColor(message.type)}`}>
                {message.title}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(message.timestamp).toLocaleString()}
            </div>
        </div>
    );
}

export default MessageItem;
