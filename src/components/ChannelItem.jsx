// components/ChannelItem.jsx
import React from "react";
import MessageItem from "./MessageItem";

function ChannelItem({ channel, isExpanded, onToggleExpand, onSelectMessage }) {
    return (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
            {/* Channel Header */}
            <div
                className="flex justify-between items-center p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={onToggleExpand}
            >
                <span className="font-semibold text-gray-800 dark:text-white">{channel.name}</span>
                <span className="text-sm text-gray-500 dark:text-gray-300">
                    {isExpanded ? "▲" : "▼"}
                </span>
            </div>

            {/* Message List (if expanded) */}
            {isExpanded && channel.messages.length > 0 && (
                <div className="px-4 py-2 space-y-2 bg-white dark:bg-[#1e1e1e] border-t border-gray-100 dark:border-gray-700">
                    {channel.messages.map((msg) => (
                        <MessageItem key={msg.id} message={msg} onClick={() => onSelectMessage(msg)} />
                    ))}
                </div>
            )}

            {isExpanded && channel.messages.length === 0 && (
                <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 italic bg-white dark:bg-[#1e1e1e] border-t border-gray-100 dark:border-gray-700">
                    No messages yet.
                </div>
            )}
        </div>
    );
}

export default ChannelItem;
