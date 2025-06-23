import React, { useEffect, useState } from "react";
import Layout from "./components/Layout";
import Header from "./components/Header";
import ChannelList from "./components/ChannelList";
import MessageDetails from "./components/MessageDetails";
import EmptyState from "./components/EmptyState";


function App() {
  const [channels, setChannels] = useState([]);
  const [expandedChannelId, setExpandedChannelId] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);

  const handleSelectChannel = (channelId) => {
    setExpandedChannelId((prev) => (prev === channelId ? null : channelId));
  };

  const handleSelectMessage = (message) => {
    setSelectedMessage(message);
  };

  useEffect(() => {
    window.api.onNewMessage((msg) => {
      const { channel, content } = msg;
      setChannels(prevChannels =>
        prevChannels.map(ch =>
          ch.id === channel
            ? { ...ch, messages: [content, ...ch.messages] }
            : ch
        )
      );

    });
  }, []);


  async function fetchData() {
    const channelsList = await window.api.getChannels();

    const channelsWithMessages = await Promise.all(channelsList.map(async (ch) => {
      const messages = await window.api.getMessagesForChannel(ch.id);
      return { ...ch, messages }
    }));
    setChannels(channelsWithMessages);
  }

  useEffect(() => {
    fetchData();
  }, [])

  return (
    <div className="h-screen w-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white font-sans">
      <Header />
      <Layout
        sidebar={
          <ChannelList
            channels={channels}
            expandedChannelId={expandedChannelId}
            onSelectChannel={handleSelectChannel}
            onSelectMessage={handleSelectMessage}
            selectedMessage={selectedMessage}
          />
        }
        content={
          selectedMessage ? (
            <MessageDetails message={selectedMessage} />
          ) : (
            <EmptyState />
          )
        }
      />
    </div>
  );
}

export default App
