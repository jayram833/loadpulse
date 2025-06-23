import ChannelItem from "./ChannelItem";

function ChannelList({ channels, expandedChannelId, onSelectChannel, onSelectMessage, selectedMessage }) {
    return (
        <div className="p-4 space-y-4">
            <h2 className="text-lg font-semibold text-[#323130] dark:text-[#f3f2f1] mb-2 tracking-wide">
                Channels
            </h2>

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
