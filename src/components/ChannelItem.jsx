import { useEffect, useState } from "react";
import MessageItem from "./MessageItem";
import { useInView } from "react-intersection-observer";


function ChannelItem({ channel, isExpanded, onToggleExpand, selectedMessage, onSelectMessage }) {

    const [visibleCount, setVisibleCount] = useState(10);
    const { ref, inView } = useInView({ threshold: 0, rootMargin: "50px" });

    useEffect(() => {
        if (inView && visibleCount < channel.messages.length) {
            setVisibleCount((prev) => Math.min(prev + 10, channel.messages.length));
        }
    }, [inView, visibleCount, channel.messages.length]);

    return (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
            <div
                className="flex justify-between items-center p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={onToggleExpand}
            >
                <span className="font-semibold text-gray-800 dark:text-white">{channel.name}</span>
                <div className="flex items-center gap-2">
                    <span className="text-blue-800 dark:text-blue-400">
                        {channel.messages.length}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-300">
                        {isExpanded ? "▲" : "▼"}
                    </span>
                </div>
            </div>

            {isExpanded && channel.messages.length > 0 && (
                <div className="px-4 py-2 space-y-2 bg-white dark:bg-[#1e1e1e] border-t border-gray-100 dark:border-gray-700 max-h-96 scrollbar-stable overflow-y-scroll scrollbar-thin dark:scrollbar-thumb-blue-500 scrollbar-track-slate-800 ">
                    {channel.messages.slice(0, visibleCount).map((msg) => (
                        <MessageItem
                            key={msg.id}
                            message={msg}
                            onClick={() => onSelectMessage(msg)}
                            selectedMessage={selectedMessage}
                        />
                    ))}
                    {visibleCount < channel.messages.length && (
                        <div ref={ref} className="h-6" />
                    )}
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
