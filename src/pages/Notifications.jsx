import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const NotificationsPage = () => {
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          throw new Error('Authentication required');
        }

        const response = await axios.get('https://matc.matchdada.com/public/api/getUserNotifications', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          const formattedNotifications = response.data.notifications.map(notif => ({
            id: notif.id,
            type: 'match',
            description: notif.description || 'New match request',
            time: notif.time || 'Just now',
            status: notif.status || 'unread',
            matchStatus: notif.matchStatus || 'pending',
            originalMatchDetails: notif.fullDetails?.match || null,
            proposedMatchDetails: {
              matchbid: notif.fullDetails?.matchbid,
              matchdate: notif.fullDetails?.matchdate,
              overs: notif.fullDetails?.overs,
              venue: notif.fullDetails?.venue,
              rules: Array.isArray(notif.fullDetails?.rules) ? notif.fullDetails.rules : [],
              paymentmethod: notif.fullDetails?.paymentmethod,
              message: notif.fullDetails?.message,
            },
            sender: notif.fullDetails?.sender || null
          }));
          
          setNotifications(formattedNotifications);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        console.error('Error fetching notifications:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const getUserID = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.id;
  };

  const handleAccept = async (id) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('Authentication required');

      await axios.post(`https://matc.matchdada.com/public/api/notifications/${id}/accept`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setNotifications(notifications.map(notif => 
        notif.id === id ? {
          ...notif, 
          status: 'read',
          matchStatus: 'accepted',
          title: 'Match Accepted'
        } : notif
      ));
      setSelectedNotification(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      console.error('Error accepting match:', err);
    }
  };

  const handleReject = async (id) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('Authentication required');

      await axios.post(`https://matc.matchdada.com/public/api/notifications/${id}/reject`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setNotifications(notifications.map(notif => 
        notif.id === id ? {
          ...notif, 
          status: 'read',
          matchStatus: 'rejected',
          title: 'Match Rejected'
        } : notif
      ));
      setSelectedNotification(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      console.error('Error rejecting match:', err);
    }
  };

  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification);

    if (notification.status === 'unread') {
      setNotifications(notifications.map(notif => 
        notif.id === notification.id ? { ...notif, status: 'read' } : notif
      ));
      
      markAsRead(notification.id);
    }
  };

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;
      
      await axios.post(`https://matc.matchdada.com/public/api/notifications/${id}/mark-read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const filteredNotifications = notifications.filter(notif => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'matches') return notif.type === 'match';
    if (activeFilter === 'pending') return notif.matchStatus === 'pending';
    return true;
  });

  if (loading) {
    return (
      <NotificationsContainer>
        <Sidebar>
          <SidebarHeader>
            <h2>Notifications</h2>
          </SidebarHeader>
          <LoadingMessage>Loading notifications...</LoadingMessage>
        </Sidebar>
        <DetailView>
          <EmptyState>
            <h3>Loading...</h3>
          </EmptyState>
        </DetailView>
      </NotificationsContainer>
    );
  }

  if (error) {
    return (
      <NotificationsContainer>
        <Sidebar>
          <SidebarHeader>
            <h2>Notifications</h2>
          </SidebarHeader>
          <ErrorMessage>{error}</ErrorMessage>
        </Sidebar>
        <DetailView>
          <EmptyState>
            <h3>Error loading notifications</h3>
            <p>{error}</p>
          </EmptyState>
        </DetailView>
      </NotificationsContainer>
    );
  }

  return (
    <NotificationsContainer>
      <Sidebar>
        <SidebarHeader>
          <h2>Notifications</h2>
          <FilterOptions>
            <FilterButton 
              active={activeFilter === 'all'} 
              onClick={() => setActiveFilter('all')}
            >
              All
            </FilterButton>
            <FilterButton 
              active={activeFilter === 'matches'} 
              onClick={() => setActiveFilter('matches')}
            >
              Matches
            </FilterButton>
            <FilterButton 
              active={activeFilter === 'pending'} 
              onClick={() => setActiveFilter('pending')}
            >
              Pending
            </FilterButton>
          </FilterOptions>
        </SidebarHeader>
        
        <NotificationsList>
          {filteredNotifications.length === 0 ? (
            <EmptyListMessage>No notifications found</EmptyListMessage>
          ) : (
            filteredNotifications.map(notification => (
              <NotificationItem 
                key={notification.id}
                unread={notification.status === 'unread'}
                onClick={() => handleNotificationClick(notification)}
              >
                <NotificationIcon type={notification.type}>
                  {notification.type === 'match' && '🤝'}
                </NotificationIcon>
                <NotificationContent>
                  <NotificationTitle>
                    {notification.matchStatus === 'pending' ? 'Match Request' : 
                     notification.matchStatus === 'accepted' ? 'Match Accepted' : 
                     'Match Rejected'}
                  </NotificationTitle>
                  <NotificationDesc>{notification.description}</NotificationDesc>
                  <NotificationTime>{notification.time}</NotificationTime>
                </NotificationContent>
                {notification.status === 'unread' && <UnreadBadge />}
                {notification.matchStatus === 'pending' && (
                  <PendingBadge>Pending</PendingBadge>
                )}
              </NotificationItem>
            ))
          )}
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
              <DetailTitle>
                {selectedNotification.matchStatus === 'pending' ? 'Match Request' : 
                 selectedNotification.matchStatus === 'accepted' ? 'Match Accepted' : 
                 'Match Rejected'}
              </DetailTitle>
              <DetailTime>{selectedNotification.time}</DetailTime>
            </DetailHeader>

            <DetailContent>
              {selectedNotification.type === 'match' && (
                <>
                  {/* Sender Profile Section */}
                  <MatchProfile>
                    <ProfileImage 
                      src={selectedNotification.sender?.photo || `https://ui-avatars.com/api/?name=${selectedNotification.sender?.name || 'U'}&background=random`} 
                      alt="Sender"
                    />
                    <ProfileInfo>
                      <ProfileName>
                        {selectedNotification.sender?.name || 'Unknown User'}
                        <StatusBadge 
                          accepted={selectedNotification.matchStatus === 'accepted'}
                          rejected={selectedNotification.matchStatus === 'rejected'}
                        >
                          {selectedNotification.matchStatus === 'pending' ? 'Pending' : 
                           selectedNotification.matchStatus === 'accepted' ? 'Accepted' : 
                           'Rejected'}
                        </StatusBadge>
                      </ProfileName>
                      <ProfileMeta>Sent you a match request</ProfileMeta>
                    </ProfileInfo>
                  </MatchProfile>

                  {/* Original Match Details Section */}
                  {selectedNotification.originalMatchDetails && (
                    <>
                      <SectionTitle>Original Match Details</SectionTitle>
                      <MatchDetailsCard>
                        <DetailRow>
                          <DetailLabel>Team Name:</DetailLabel>
                          <DetailValue>{selectedNotification.originalMatchDetails.team_name || 'N/A'}</DetailValue>
                        </DetailRow>
                        <DetailRow>
                          <DetailLabel>Captain:</DetailLabel>
                          <DetailValue>{selectedNotification.originalMatchDetails.captain_name || 'N/A'}</DetailValue>
                        </DetailRow>
                        <DetailRow>
                          <DetailLabel>Match Date:</DetailLabel>
                          <DetailValue>
                            {selectedNotification.originalMatchDetails.match_datetime 
                              ? new Date(selectedNotification.originalMatchDetails.match_datetime).toLocaleString() 
                              : 'N/A'}
                          </DetailValue>
                        </DetailRow>
                        <DetailRow>
                          <DetailLabel>Venue:</DetailLabel>
                          <DetailValue>{selectedNotification.originalMatchDetails.venue || 'N/A'}</DetailValue>
                        </DetailRow>
                        <DetailRow>
                          <DetailLabel>City:</DetailLabel>
                          <DetailValue>{selectedNotification.originalMatchDetails.city || 'N/A'}</DetailValue>
                        </DetailRow>
                        <DetailRow>
                          <DetailLabel>Province:</DetailLabel>
                          <DetailValue>{selectedNotification.originalMatchDetails.province || 'N/A'}</DetailValue>
                        </DetailRow>
                        <DetailRow>
                          <DetailLabel>Overs:</DetailLabel>
                          <DetailValue>{selectedNotification.originalMatchDetails.overs || 'N/A'}</DetailValue>
                        </DetailRow>
                        <DetailRow>
                          <DetailLabel>Ball Type:</DetailLabel>
                          <DetailValue>{selectedNotification.originalMatchDetails.ball_type || 'N/A'}</DetailValue>
                        </DetailRow>
                        <DetailRow>
                          <DetailLabel>Payment Method:</DetailLabel>
                          <DetailValue>{selectedNotification.originalMatchDetails.payment_method || 'N/A'}</DetailValue>
                        </DetailRow>
                        <DetailRow>
                          <DetailLabel>Dress Code:</DetailLabel>
                          <DetailValue>{selectedNotification.originalMatchDetails.dress_code || 'N/A'}</DetailValue>
                        </DetailRow>
                        <DetailRow>
                          <DetailLabel>Rules:</DetailLabel>
                          <DetailValue>
                            {selectedNotification.originalMatchDetails.rules && selectedNotification.originalMatchDetails.rules.length > 0 ? (
                              <RulesList>
                                {selectedNotification.originalMatchDetails.rules.map((rule, index) => (
                                  <li key={index}>{rule}</li>
                                ))}
                              </RulesList>
                            ) : 'No rules specified'}
                          </DetailValue>
                        </DetailRow>
                      </MatchDetailsCard>
                    </>
                  )}

                  {/* Proposed Match Changes Section */}
                  <SectionTitle>Proposed Changes</SectionTitle>
                  <MatchDetailsCard>
                    {selectedNotification.proposedMatchDetails.matchdate && (
                      <DetailRow>
                        <DetailLabel>Proposed Date:</DetailLabel>
                        <DetailValue>
                          {new Date(selectedNotification.proposedMatchDetails.matchdate).toLocaleString()}
                        </DetailValue>
                      </DetailRow>
                    )}
                    {selectedNotification.proposedMatchDetails.overs && (
                      <DetailRow>
                        <DetailLabel>Proposed Overs:</DetailLabel>
                        <DetailValue>{selectedNotification.proposedMatchDetails.overs}</DetailValue>
                      </DetailRow>
                    )}
                    {selectedNotification.proposedMatchDetails.venue && (
                      <DetailRow>
                        <DetailLabel>Proposed Venue:</DetailLabel>
                        <DetailValue>{selectedNotification.proposedMatchDetails.venue}</DetailValue>
                      </DetailRow>
                    )}
                    {selectedNotification.proposedMatchDetails.paymentmethod && (
                      <DetailRow>
                        <DetailLabel>Proposed Payment Method:</DetailLabel>
                        <DetailValue>{selectedNotification.proposedMatchDetails.paymentmethod}</DetailValue>
                      </DetailRow>
                    )}
                    {selectedNotification.proposedMatchDetails.rules && selectedNotification.proposedMatchDetails.rules.length > 0 && (
                      <DetailRow>
                        <DetailLabel>Proposed Rules:</DetailLabel>
                        <DetailValue>
                          <RulesList>
                            {selectedNotification.proposedMatchDetails.rules.map((rule, index) => (
                              <li key={index}>{rule}</li>
                            ))}
                          </RulesList>
                        </DetailValue>
                      </DetailRow>
                    )}
                    {selectedNotification.proposedMatchDetails.message && (
                      <Section>
                        <SectionTitle>Message</SectionTitle>
                        <MessageBox>
                          {selectedNotification.proposedMatchDetails.message}
                        </MessageBox>
                      </Section>
                    )}
                  </MatchDetailsCard>
                </>
              )}
            </DetailContent>

            {selectedNotification.type === 'match' && 
              selectedNotification.matchStatus === 'pending' && (
              <ActionButtons>
                <RejectButton onClick={() => handleReject(selectedNotification.id)}>
                  Reject
                </RejectButton>
                <AcceptButton onClick={() => handleAccept(selectedNotification.id)}>
                  Accept
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
  background-color: #fff;
`;

const SidebarHeader = styled.div`
  padding: 15px;
  border-bottom: 1px solid #e1e1e1;
  background-color: #f8f9fa;

  h2 {
    margin-bottom: 15px;
    font-size: 1.5rem;
    color: #333;
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
  transition: all 0.2s;

  &:hover {
    background: ${props => props.active ? '#0084ff' : '#e0e2e5'};
  }
`;

const NotificationsList = styled.div`
  flex: 1;
  overflow-y: auto;
  background-color: #fff;
`;

const NotificationItem = styled.div`
  display: flex;
  padding: 15px;
  cursor: pointer;
  position: relative;
  background-color: ${props => props.unread ? '#f5f9ff' : 'transparent'};
  border-bottom: 1px solid #f0f2f5;
  transition: background-color 0.2s;

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
  flex-shrink: 0;
`;

const NotificationContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const NotificationTitle = styled.h3`
  font-size: 14px;
  margin-bottom: 3px;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const NotificationDesc = styled.p`
  font-size: 13px;
  color: #666;
  margin-bottom: 3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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

const PendingBadge = styled.span`
  position: absolute;
  right: 15px;
  bottom: 15px;
  font-size: 11px;
  color: #ff9800;
  font-weight: bold;
`;

const DetailView = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #fff;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #666;
  padding: 20px;
  text-align: center;

  h3 {
    margin-bottom: 10px;
    font-weight: normal;
    color: #333;
  }

  p {
    font-size: 14px;
    color: #999;
  }
`;

const DetailHeader = styled.div`
  padding: 15px;
  border-bottom: 1px solid #e1e1e1;
  position: relative;
  background-color: #f8f9fa;
`;

const BackButton = styled.button`
  position: absolute;
  left: 15px;
  top: 15px;
  background: none;
  border: none;
  color: #0084ff;
  cursor: pointer;
  font-size: 14px;
  padding: 5px;
  border-radius: 4px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #e3f2fd;
  }
`;

const DetailTitle = styled.h2`
  text-align: center;
  font-size: 18px;
  margin-top: 5px;
  color: #333;
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
  padding-bottom: 20px;
  border-bottom: 1px solid #f0f2f5;
`;

const ProfileImage = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-right: 20px;
  object-fit: cover;
  border: 2px solid #e1e1e1;
`;

const ProfileInfo = styled.div`
  flex: 1;
`;

const ProfileName = styled.h3`
  font-size: 20px;
  margin-bottom: 5px;
  color: #333;
  display: flex;
  align-items: center;
`;

const ProfileMeta = styled.p`
  color: #666;
  margin-bottom: 5px;
  font-size: 14px;
`;

const StatusBadge = styled.span`
  margin-left: 10px;
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
  background-color: ${props => 
    props.accepted ? '#e6f7ee' : 
    props.rejected ? '#feeceb' : '#fff8e6'};
  color: ${props => 
    props.accepted ? '#0a8f4f' : 
    props.rejected ? '#f44336' : '#ff9800'};
`;

const SectionTitle = styled.h4`
  margin: 20px 0 10px 0;
  color: #666;
  font-size: 16px;
  font-weight: 600;
`;

const MatchDetailsCard = styled.div`
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: 1px solid #e1e1e1;
`;

const DetailRow = styled.div`
  display: flex;
  margin-bottom: 10px;
  align-items: flex-start;
`;

const DetailLabel = styled.div`
  font-weight: 600;
  color: #333;
  width: 180px;
  flex-shrink: 0;
`;

const DetailValue = styled.div`
  color: #555;
  flex: 1;
`;

const RulesList = styled.ul`
  margin: 0;
  padding-left: 20px;
  li {
    margin-bottom: 5px;
  }
`;

const Section = styled.div`
  margin-top: 15px;
`;

const MessageBox = styled.div`
  background: #f5f5f5;
  padding: 10px;
  border-radius: 4px;
  border-left: 3px solid #0084ff;
`;

const ActionButtons = styled.div`
  display: flex;
  padding: 15px;
  border-top: 1px solid #e1e1e1;
  gap: 15px;
  background-color: #f8f9fa;
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
  transition: background-color 0.2s;

  &:hover {
    background-color: #3d8b40;
  }
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
  transition: background-color 0.2s;

  &:hover {
    background-color: #d32f2f;
  }
`;

const LoadingMessage = styled.div`
  padding: 20px;
  text-align: center;
  color: #666;
`;

const ErrorMessage = styled.div`
  padding: 20px;
  text-align: center;
  color: #f44336;
  font-weight: bold;
`;

const EmptyListMessage = styled.div`
  padding: 20px;
  text-align: center;
  color: #666;
`;

export default NotificationsPage;