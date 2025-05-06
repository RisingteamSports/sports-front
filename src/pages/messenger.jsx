import React, { useState } from 'react';
import styled from 'styled-components';

const Messenger = () => {
  const [currentChat, setCurrentChat] = useState(null);
  const [message, setMessage] = useState('');
  
  const [contacts, setContacts] = useState([
    { id: 1, name: 'John Doe', avatar: 'https://i.pravatar.cc/150?img=1', lastMessage: 'Hey, how are you?', time: '10:30 AM', unread: 2 },
    { id: 2, name: 'Jane Smith', avatar: 'https://i.pravatar.cc/150?img=2', lastMessage: 'Meeting at 3pm', time: 'Yesterday', unread: 0 },
    { id: 3, name: 'Mike Johnson', avatar: 'https://i.pravatar.cc/150?img=3', lastMessage: 'Please send the files', time: 'Yesterday', unread: 5 },
  ]);

  const [messages, setMessages] = useState({
    1: [
      { id: 1, text: 'Hey there!', sender: 'other', time: '10:00 AM' },
      { id: 2, text: 'How are you doing?', sender: 'other', time: '10:02 AM' },
      { id: 3, text: "I'm good, thanks!", sender: 'me', time: '10:05 AM' },
    ],
    2: [
      { id: 1, text: 'Don\'t forget about our meeting', sender: 'other', time: '9:30 AM' },
      { id: 2, text: 'I\'ll be there', sender: 'me', time: '9:35 AM' },
    ],
    3: [
      { id: 1, text: 'Did you finish the project?', sender: 'other', time: '2:00 PM' },
      { id: 2, text: 'Almost done, will send it soon', sender: 'me', time: '2:30 PM' },
    ],
  });

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!currentChat || !message.trim()) return;
    
    const newMessage = {
      id: messages[currentChat.id].length + 1,
      text: message,
      sender: 'me',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => ({
      ...prev,
      [currentChat.id]: [...prev[currentChat.id], newMessage]
    }));
    
    setMessage('');
  };

  return (
    <MessengerContainer>
      <Sidebar>
        <SidebarHeader>
          <h2>Chats</h2>
          <SearchBox>
            <input type="text" placeholder="Search contacts..." />
          </SearchBox>
        </SidebarHeader>
        
        <ContactsList>
          {contacts.map(contact => (
            <ContactItem 
              key={contact.id} 
              active={currentChat?.id === contact.id}
              onClick={() => setCurrentChat(contact)}
            >
              <Avatar src={contact.avatar} alt={contact.name} />
              <ContactInfo>
                <ContactName>{contact.name}</ContactName>
                <LastMessage>{contact.lastMessage}</LastMessage>
              </ContactInfo>
              <MessageMeta>
                <Time>{contact.time}</Time>
                {contact.unread > 0 && <UnreadCount>{contact.unread}</UnreadCount>}
              </MessageMeta>
            </ContactItem>
          ))}
        </ContactsList>
      </Sidebar>

      <ChatArea>
        {!currentChat ? (
          <EmptyState>
            <h3>Select a chat to start messaging</h3>
          </EmptyState>
        ) : (
          <>
            <ChatHeader>
              <UserInfo>
                <Avatar src={currentChat.avatar} alt={currentChat.name} />
                <div>
                  <h3>{currentChat.name}</h3>
                  <Status>Online</Status>
                </div>
              </UserInfo>
            </ChatHeader>

            <MessagesContainer>
              {messages[currentChat.id].map(msg => (
                <Message key={msg.id} sender={msg.sender}>
                  <MessageContent sender={msg.sender}>
                    <p>{msg.text}</p>
                    <MessageTime>{msg.time}</MessageTime>
                  </MessageContent>
                </Message>
              ))}
            </MessagesContainer>

            <MessageForm onSubmit={handleSendMessage}>
              <MessageInput
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
              />
              <SendButton type="submit">Send</SendButton>
            </MessageForm>
          </>
        )}
      </ChatArea>
    </MessengerContainer>
  );
};

// Styled Components
const MessengerContainer = styled.div`
  display: flex;
  height: 100vh;
  width: 100%;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const Sidebar = styled.div`
  width: 350px;
  border-right: 1px solid #e1e1e1;
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const SidebarHeader = styled.div`
  padding: 15px;
  border-bottom: 1px solid #e1e1e1;

  h2 {
    margin-bottom: 15px;
  }
`;

const SearchBox = styled.div`
  input {
    width: 100%;
    padding: 8px 15px;
    border: 1px solid #e1e1e1;
    border-radius: 20px;
    outline: none;
  }
`;

const ContactsList = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const ContactItem = styled.div`
  display: flex;
  padding: 10px 15px;
  align-items: center;
  cursor: pointer;
  background-color: ${props => props.active ? '#f0f2f5' : 'transparent'};
  border-bottom: 1px solid #f0f2f5;

  &:hover {
    background-color: #f5f5f5;
  }
`;

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
`;

const ContactInfo = styled.div`
  flex: 1;
`;

const ContactName = styled.h3`
  font-size: 14px;
  margin-bottom: 2px;
`;

const LastMessage = styled.p`
  font-size: 12px;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const MessageMeta = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const Time = styled.span`
  font-size: 11px;
  color: #666;
`;

const UnreadCount = styled.span`
  background-color: #0084ff;
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  margin-top: 3px;
`;

const ChatArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const EmptyState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-color: #f8f9fa;

  h3 {
    color: #666;
    font-weight: normal;
  }
`;

const ChatHeader = styled.div`
  padding: 15px;
  border-bottom: 1px solid #e1e1e1;
  display: flex;
  align-items: center;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;

  h3 {
    font-size: 16px;
  }
`;

const Status = styled.p`
  font-size: 12px;
  color: #666;
`;

const MessagesContainer = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background-color: #f5f5f5;
`;

const Message = styled.div`
  margin-bottom: 15px;
  display: flex;
  justify-content: ${props => props.sender === 'me' ? 'flex-end' : 'flex-start'};
`;

const MessageContent = styled.div`
  max-width: 70%;
  padding: 10px 15px;
  border-radius: 18px;
  position: relative;
  background-color: ${props => props.sender === 'me' ? '#0084ff' : '#e4e6eb'};
  color: ${props => props.sender === 'me' ? 'white' : '#050505'};
`;

const MessageTime = styled.span`
  font-size: 11px;
  margin-top: 5px;
  display: block;
  text-align: right;
  opacity: 0.8;
`;

const MessageForm = styled.form`
  padding: 15px;
  border-top: 1px solid #e1e1e1;
  display: flex;
`;

const MessageInput = styled.input`
  flex: 1;
  padding: 10px 15px;
  border: 1px solid #e1e1e1;
  border-radius: 20px;
  outline: none;
  margin-right: 10px;
`;

const SendButton = styled.button`
  padding: 10px 20px;
  background-color: #0084ff;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;

  &:hover {
    background-color: #0073e6;
  }
`;

export default Messenger;