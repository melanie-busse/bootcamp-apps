import Headline from "@/components/Headline/Headline";
import { useSession, signOut, signIn } from "next-auth/react";
import styled from "styled-components";
import { StyledButton } from "@/components/Button";
import ListContainer from "@/components/Container/ListContainer";

export default function ProfilePage() {
    const { data: session } = useSession();

    if (session) {
        return (
            <ListContainer>
                <Headline headline="Profile" />
                <ProfileCard>
                    <CardHeader>
                        <UserAvatar src={session.user.image || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"} alt="Avatar" />
                        <Username>{session.user.name}</Username>
                    </CardHeader>

                    <InfoSection>
                        <StyledSubheading>User information</StyledSubheading>
                        <InfoRow>
                            <Label>Username:</Label>
                            <Value>{session.user.name}</Value>
                        </InfoRow>
                        <InfoRow>
                            <Label>E-Mail address:</Label>
                            <Value>{session.user.email}</Value>
                        </InfoRow>
                    </InfoSection>

                    <SettingsSection>
                        <StyledSubheading>Settings</StyledSubheading>
                        <LogButton onClick={() => signOut()}>Log out</LogButton>
                    </SettingsSection>
                </ProfileCard>
            </ListContainer>
        );
    }

    return (
        <ListContainer>
            <Headline headline="Profile" />
            <ProfileCard>
                <LoggedOutWrapper>
                    <p>You are currently logged out</p>
                    <LogButton onClick={() => signIn()}>Log in</LogButton>
                </LoggedOutWrapper>
            </ProfileCard>
        </ListContainer>
    );
}

const ProfileCard = styled.article`
  background-color: #ffffff;
  border: 3px solid #3d4ef5;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 500px;
  margin: 2rem auto;
`;

const CardHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 1.5rem;
`;

const UserAvatar = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #005f5f; 
`;

const Username = styled.h2`
  font-family: "Caveat", cursive;
  font-size: 2.8rem;
  margin: 0;
  color: #333;
`;

const InfoSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

const StyledSubheading = styled.h3`
  font-family: "Caveat", cursive;
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
  color: #005f5f;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.2rem 0;
`;

const Label = styled.span`
  font-weight: 600;
  color: #666;
`;

const Value = styled.span`
  color: #333;
`;

const SettingsSection = styled.section`
  margin-top: 1rem;
  padding-top: 0.8rem;
  padding-bottom: 0.8rem;
  border-top: 1px solid #f0f0f0;
  display: flex;
  flex-direction: column;
`;

const LogButton = styled(StyledButton)`
  background-color: #005f5f;
  color: white;
  border: none;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #004646;
    cursor: pointer;
  }
`;

const LoggedOutWrapper = styled.div`
  text-align: center;
  padding: 1rem;
  font-family: "Caveat", cursive;
  font-size: 1.6rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  align-items: center;
`;