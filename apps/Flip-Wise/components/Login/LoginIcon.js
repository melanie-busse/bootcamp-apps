import styled from "styled-components";
import { AiOutlineUser } from "react-icons/ai";
import { useSession } from "next-auth/react";
import LoginButton from "./LoginButton";
import ProfileButton from "./ProfileButton";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useState } from "react";

export default function LoginIcon() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  if (session) {
    return (
      <>
        <ProfileButton onClick={() => setIsOpen(!isOpen)}>
          {session.user.image ? (
            <StyledProfilePicture
              src={session.user.image}
            ></StyledProfilePicture>
          ) : (
            <StyledLoginIcon $isLoggedIn={true} />
          )}
        </ProfileButton>
        <StyledProfileMenu $isOpen={isOpen}>
          <StyledProfileLink href="/profile" onClick={() => setIsOpen(false)}>
            Profile
          </StyledProfileLink>
          <StyledLogoutButton onClick={() => signOut()}>
            Log out
          </StyledLogoutButton>
        </StyledProfileMenu>
      </>
    );
  }
  return (
    <>
      <LoginButton>
        <StyledLoginIcon />
      </LoginButton>
    </>
  );
}

const StyledLoginIcon = styled(AiOutlineUser)`
  fill: ${({ $isLoggedIn }) => ($isLoggedIn ? "#000" : "#fff")};
  width: 40px;
  height: 40px;
`;

const StyledProfilePicture = styled.img`
  width: 100%;
`;

const StyledProfileMenu = styled.div`
  position: absolute;
  right: 40px;
  top: 76%;
  display: ${({ $isOpen }) => ($isOpen ? "flex" : "none")};
  flex-direction: column;
  background: linear-gradient(160deg, #003d45 0%, #00575f 60%, #006b6b 100%);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.22);
  border: 1px solid rgba(62, 207, 178, 0.15);
  padding: 20px 20px;
  gap: 15px;
  text-align: right;
`;

const StyledLogoutButton = styled.button`
  color: #e0f7f4;
  border: none;
  background-color: transparent;
  padding: 8px 12px;
  font-size: 0.9rem;
  cursor: pointer;
  &:hover {
    background: rgba(255, 255, 255, 0.12);
    color: #ffffff;
    border-radius: 10px;
  }
`;

const StyledProfileLink = styled(Link)`
  color: #e0f7f4;
  text-decoration: none;
  padding: 8px 12px;
  font-size: 0.9rem;
  &:hover {
    background: rgba(255, 255, 255, 0.12);
    color: #ffffff;
    border-radius: 10px;
  }
`;
