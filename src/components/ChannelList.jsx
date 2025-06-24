import ChannelItem from "./ChannelItem";

function ChannelList({ channels, expandedChannelId, onSelectChannel, onSelectMessage, selectedMessage, onAddChannel }) {
    return (
        <div className="p-4 space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-[#323130] dark:text-[#f3f2f1]  tracking-wide">
                    Channels
                </h2>
                <button onClick={onAddChannel} className="bg-indigo-900 cursor-pointer hover:bg-indigo-800 text-sm rounded-sm px-2 py-1 text-white">Add Channel</button>
            </div>

            {channels.map((channel) => (
                <ChannelItem
                    key={channel.id}
                    channel={channel}
                    isExpanded={expandedChannelId === channel.id}
                    onToggleExpand={() => onSelectChannel(channel.id)}
                    onSelectMessage={onSelectMessage}
                    selectedMessage={selectedMessage}
                />
            ))}
        </div>
    );
}

export default ChannelList;
