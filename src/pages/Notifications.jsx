import React, { useState } from 'react';
import styled from 'styled-components';

const NotificationsPage = () => {
  const [selectedNotification, setSelectedNotification] = useState(null);
  
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'match',
      title: 'New Match Request',
      description: 'John Doe wants to match with you',
      time: '10 mins ago',
      status: 'pending',
      fullDetails: {
        name: 'John Doe',
        age: 28,
        location: 'New York',
        bio: 'Software engineer who loves hiking and photography',
        mutualInterests: ['Hiking', 'Photography', 'Travel'],
        matchPercentage: 87
      }
    },
    {
      id: 2,
      type: 'message',
      title: 'New Message',
      description: 'Jane Smith sent you a message',
      time: '1 hour ago',
      status: 'unread',
      fullDetails: {
        preview: 'Hey there! How are you doing?',
        conversationId: 123
      }
    },
    {
      id: 3,
      type: 'match',
      title: 'Match Accepted',
      description: 'Mike Johnson accepted your match request',
      time: 'Yesterday',
      status: 'accepted',
      fullDetails: {
        name: 'Mike Johnson',
        age: 31,
        location: 'Chicago',
        bio: 'Musician and coffee enthusiast',
        mutualInterests: ['Music', 'Coffee', 'Reading']
      }
    },
    {
      id: 4,
      type: 'system',
      title: 'Profile Viewed',
      description: 'Someone viewed your profile',
      time: '2 days ago',
      status: 'read',
      fullDetails: {
        count: 5
      }
    }
  ]);

  const handleAccept = (id) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? {...notif, status: 'accepted'} : notif
    ));
    setSelectedNotification(null);
  };

  const handleReject = (id) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? {...notif, status: 'rejected'} : notif
    ));
    setSelectedNotification(null);
  };

  return (
    <NotificationsContainer>
      <Sidebar>
        <SidebarHeader>
          <h2>Notifications</h2>
          <FilterOptions>
            <FilterButton active>All</FilterButton>
            <FilterButton>Matches</FilterButton>
            <FilterButton>Messages</FilterButton>
          </FilterOptions>
        </SidebarHeader>
        
        <NotificationsList>
          {notifications.map(notification => (
            <NotificationItem 
              key={notification.id}
              unread={notification.status === 'unread'}
              onClick={() => setSelectedNotification(notification)}
            >
              <NotificationIcon type={notification.type}>
                {notification.type === 'match' && '🤝'}
                {notification.type === 'message' && '💬'}
                {notification.type === 'system' && 'ℹ️'}
              </NotificationIcon>
              <NotificationContent>
                <NotificationTitle>{notification.title}</NotificationTitle>
                <NotificationDesc>{notification.description}</NotificationDesc>
                <NotificationTime>{notification.time}</NotificationTime>
              </NotificationContent>
              {notification.status === 'unread' && <UnreadBadge />}
            </NotificationItem>
          ))}
        </NotificationsList>
      </Sidebar>

      <DetailView>
        {!selectedNotification ? (
          <EmptyState>
            <h3>Select a notification to view details</h3>
            <p>Your notifications will appear here</p>
          </EmptyState>
        ) : (
          <>
            <DetailHeader>
              <BackButton onClick={() => setSelectedNotification(null)}>
                &larr; Back
              </BackButton>
              <DetailTitle>{selectedNotification.title}</DetailTitle>
              <DetailTime>{selectedNotification.time}</DetailTime>
            </DetailHeader>

            <DetailContent>
              {selectedNotification.type === 'match' && (
                <>
                  <MatchProfile>
                    <ProfileImage src={`https://i.pravatar.cc/150?img=${selectedNotification.id}`} />
                    <ProfileInfo>
                      <ProfileName>{selectedNotification.fullDetails.name}</ProfileName>
                      <ProfileMeta>{selectedNotification.fullDetails.age} • {selectedNotification.fullDetails.location}</ProfileMeta>
                      <MatchPercentage>
                        Match: {selectedNotification.fullDetails.matchPercentage}%
                      </MatchPercentage>
                    </ProfileInfo>
                  </MatchProfile>

                  <SectionTitle>About</SectionTitle>
                  <SectionContent>{selectedNotification.fullDetails.bio}</SectionContent>

                  <SectionTitle>Mutual Interests</SectionTitle>
                  <InterestList>
                    {selectedNotification.fullDetails.mutualInterests.map((interest, i) => (
                      <InterestTag key={i}>{interest}</InterestTag>
                    ))}
                  </InterestList>
                </>
              )}

              {selectedNotification.type === 'message' && (
                <>
                  <MessagePreview>
                    "{selectedNotification.fullDetails.preview}"
                  </MessagePreview>
                  <ViewConversationButton>
                    View Conversation
                  </ViewConversationButton>
                </>
              )}

              {selectedNotification.type === 'system' && (
                <SystemMessage>
                  Your profile was viewed {selectedNotification.fullDetails.count} times
                </SystemMessage>
              )}
            </DetailContent>

            {selectedNotification.type === 'match' && selectedNotification.status === 'pending' && (
              <ActionButtons>
                <RejectButton onClick={() => handleReject(selectedNotification.id)}>
                  Reject
                </RejectButton>
                <AcceptButton onClick={() => handleAccept(selectedNotification.id)}>
                  Accept Match
                </AcceptButton>
              </ActionButtons>
            )}
          </>
        )}
      </DetailView>
    </NotificationsContainer>
  );
};

// Styled Components
const NotificationsContainer = styled.div`
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

const FilterOptions = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
`;

const FilterButton = styled.button`
  padding: 5px 10px;
  border: none;
  background: ${props => props.active ? '#0084ff' : '#f0f2f5'};
  color: ${props => props.active ? 'white' : '#333'};
  border-radius: 15px;
  font-size: 12px;
  cursor: pointer;
`;

const NotificationsList = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const NotificationItem = styled.div`
  display: flex;
  padding: 15px;
  cursor: pointer;
  position: relative;
  background-color: ${props => props.unread ? '#f5f9ff' : 'transparent'};
  border-bottom: 1px solid #f0f2f5;

  &:hover {
    background-color: #f5f5f5;
  }
`;

const NotificationIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${props => 
    props.type === 'match' ? '#e3f2fd' : 
    props.type === 'message' ? '#e8f5e9' : '#f3e5f5'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  margin-right: 15px;
`;

const NotificationContent = styled.div`
  flex: 1;
`;

const NotificationTitle = styled.h3`
  font-size: 14px;
  margin-bottom: 3px;
`;

const NotificationDesc = styled.p`
  font-size: 13px;
  color: #666;
  margin-bottom: 3px;
`;

const NotificationTime = styled.span`
  font-size: 11px;
  color: #999;
`;

const UnreadBadge = styled.div`
  position: absolute;
  right: 15px;
  top: 15px;
  width: 8px;
  height: 8px;
  background-color: #0084ff;
  border-radius: 50%;
`;

const DetailView = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #666;

  h3 {
    margin-bottom: 10px;
    font-weight: normal;
  }

  p {
    font-size: 14px;
  }
`;

const DetailHeader = styled.div`
  padding: 15px;
  border-bottom: 1px solid #e1e1e1;
  position: relative;
`;

const BackButton = styled.button`
  position: absolute;
  left: 15px;
  top: 15px;
  background: none;
  border: none;
  color: #0084ff;
  cursor: pointer;
`;

const DetailTitle = styled.h2`
  text-align: center;
  font-size: 18px;
  margin-top: 5px;
`;

const DetailTime = styled.div`
  text-align: center;
  font-size: 12px;
  color: #999;
  margin-top: 5px;
`;

const DetailContent = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
`;

const MatchProfile = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const ProfileImage = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-right: 20px;
`;

const ProfileInfo = styled.div``;

const ProfileName = styled.h3`
  font-size: 20px;
  margin-bottom: 5px;
`;

const ProfileMeta = styled.p`
  color: #666;
  margin-bottom: 5px;
  font-size: 14px;
`;

const MatchPercentage = styled.div`
  color: #4caf50;
  font-weight: bold;
`;

const SectionTitle = styled.h4`
  margin: 20px 0 10px 0;
  color: #666;
`;

const SectionContent = styled.p`
  line-height: 1.5;
`;

const InterestList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const InterestTag = styled.span`
  background-color: #e3f2fd;
  color: #1976d2;
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 12px;
`;

const MessagePreview = styled.blockquote`
  font-size: 16px;
  color: #333;
  border-left: 3px solid #0084ff;
  padding-left: 15px;
  margin: 20px 0;
`;

const ViewConversationButton = styled.button`
  background-color: #0084ff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
`;

const SystemMessage = styled.div`
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 5px;
  text-align: center;
  margin-top: 20px;
`;

const ActionButtons = styled.div`
  display: flex;
  padding: 15px;
  border-top: 1px solid #e1e1e1;
  gap: 15px;
`;

const AcceptButton = styled.button`
  flex: 1;
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
`;

const RejectButton = styled.button`
  flex: 1;
  background-color: #f44336;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
`;

export default NotificationsPage;