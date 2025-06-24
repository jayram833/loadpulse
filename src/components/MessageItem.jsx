function MessageItem({ message, onClick, selectedMessage }) {
    const getColor = (type) => {
        switch (type) {
            case "BID": return "text-green-500";
            case "NO_BID": return "text-red-500";
            case "INFO": return "text-blue-500";
            default: return "text-gray-700";
        }
    };
    return (
        <div
            className={`${selectedMessage.id === message.id ? "bg-gray-100" : ""} cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-md transition`}
            onClick={onClick}
        >
            <div className={`font-sm font-semibold ${getColor(message.type)}`}>
                {message.load_id}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(message.timestamp).toLocaleString()}
            </div>
        </div>
    );
}

export default MessageItem;
