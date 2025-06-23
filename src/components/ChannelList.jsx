// components/ChannelList.jsx
import React from "react";
import ChannelItem from "./ChannelItem";

function ChannelList({ channels, expandedChannelId, onSelectChannel, onSelectMessage }) {
    return (
        <div className="p-4 space-y-4">
            <h2 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                Channels
            </h2>
            {channels.map((channel) => (
                <ChannelItem
                    key={channel.id}
                    channel={channel}
                    isExpanded={expandedChannelId === channel.id}
                    onToggleExpand={() => onSelectChannel(channel.id)}
                    onSelectMessage={onSelectMessage}
                />
            ))}
        </div>
    );
}

export default ChannelList;
