import React, { useEffect, useState } from "react";
import Layout from "./components/Layout";
import Header from "./components/Header";
import ChannelList from "./components/ChannelList";
import MessageDetails from "./components/MessageDetails";
import EmptyState from "./components/EmptyState";
import AddChannelForm from "./components/AddChannelForm";


function App() {
  const [channels, setChannels] = useState([]);
  const [channelsList, setChannelsList] = useState([]);
  const [expandedChannelId, setExpandedChannelId] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(0);

  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  const handleCloseOverlay = () => {
    setIsOverlayOpen(false);
  };

  const handleAddChannel = async function (entry) {
    console.log(entry)
    const updatedChanels = await window.api.addChannel(entry);
    setChannelsList(updatedChanels);
  };

  const handleOpenForm = function () {
    setIsOverlayOpen(true);
  }

  const handleSelectChannel = (channelId) => {
    setExpandedChannelId((prev) => (prev === channelId ? null : channelId));
  };

  const handleSelectMessage = (message) => {
    setSelectedMessage(message);
  };

  const handleSearchMessage = function (loadId) {
    if (!loadId) return;
    for (const channel of channels) {
      const message = channel.messages.find(msg => msg.load_id === loadId);
      if (message) {
        setSelectedMessage(message);
        setExpandedChannelId(channel.id);
        return;
      }
    }
    alert("No message found for that Load ID.");
  }


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
    const channelLst = await window.api.getChannels();
    setChannelsList(channelLst);

    const channelsWithMessages = await Promise.all(channelsList.map(async (ch) => {
      const messages = await window.api.getMessagesForChannel(ch.id);
      return { ...ch, messages }
    }));
    setChannels(channelsWithMessages);
  }

  useEffect(() => {
    fetchData();
  }, [channels])

  return (
    <div className="h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white font-sans ">
      <Header onSearchMessage={handleSearchMessage} />
      <Layout
        sidebar={
          <ChannelList
            channels={channels}
            expandedChannelId={expandedChannelId}
            onSelectChannel={handleSelectChannel}
            onSelectMessage={handleSelectMessage}
            selectedMessage={selectedMessage}
            onAddChannel={handleOpenForm}
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
      <AddChannelForm isOpen={isOverlayOpen}
        onClose={handleCloseOverlay}
        onAdd={handleAddChannel} />
    </div>
  );
}

export default App
