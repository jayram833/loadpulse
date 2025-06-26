import { lazy, Suspense, useEffect, useState } from "react";
import Layout from "./components/Layout";
import Header from "./components/Header";
import ChannelList from "./components/ChannelList";
import MessageDetails from "./components/MessageDetails";
import EmptyState from "./components/EmptyState";


const AddChannelForm = lazy(() => import("./components/AddChannelForm"))

function App() {
  const [channels, setChannels] = useState([]);
  const [expandedChannelId, setExpandedChannelId] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(0);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  useEffect(() => {
    function checkConnection(_, msg) {
      console.log(msg)
    }
    window.api.getConnectionStatus(checkConnection)
  }, [])

  const handleCloseOverlay = () => {
    setIsOverlayOpen(false);
  };

  const handleAddChannel = async function (entry) {
    await window.api.addChannel(entry);
    fetchData();
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
    const handleNewMessage = async (_, msg) => {
      const { channel, content } = msg;

      try {
        const newMsgId = await window.api.insertMessageToDB(msg);
        const [storedNewMessage] = await window.api.getMessageById(newMsgId);
        setChannels((prev) =>
          prev.map((ch) =>
            ch.id === channel
              ? { ...ch, messages: [storedNewMessage, ...ch.messages] }
              : ch
          )
        );
      } catch (err) {
        console.error('Failed to insert and display message:', err);
      }
    };

    const unsubscribe = window.api.onNewMessage(handleNewMessage);
    return () => {
      unsubscribe();
    };
  }, []);


  async function fetchData() {
    try {
      const channelLst = await window.api.getChannels();
      const channelsWithMessages = await Promise.all(channelLst.map(async (ch) => {
        const messages = await window.api.getMessagesForChannel(ch.id);
        return { ...ch, messages };
      }));
      setChannels(channelsWithMessages);
    } catch (e) {
      console.error("Failed to fetch", e);
    }
  }

  useEffect(() => {
    fetchData();
  }, [])

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
      {
        isOverlayOpen &&
        <Suspense fallback={<div className="mt-4 text-gray-500">Loading...</div>}>
          <AddChannelForm
            onClose={handleCloseOverlay}
            onAdd={handleAddChannel} />
        </Suspense>
      }
    </div>
  );
}

export default App
