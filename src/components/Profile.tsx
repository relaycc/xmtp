import { FunctionComponent } from "react";
import styled from "styled-components";
import { card } from "@/lib/styles";
import { Avatar } from "./Avatar";
import * as ButtonTertiary from "@/components/ButtonTertiary";
import { spaceMonoMdBold, textLgBlack } from "@/lib/typography";
import { truncateAddress } from "@/lib/truncateAddress";

export const Profile: FunctionComponent<{
  address: string | null;
  onClickX: () => unknown;
}> = ({ onClickX, address }) => {
  const whenDoesntHaveAddress = address === null;
  const whenHasAddress = address !== null;

  return (
    <Styles.Root>
      <Styles.Header>
        {whenDoesntHaveAddress && (
          <Styles.Address>No Profile Selected</Styles.Address>
        )}
        {whenHasAddress && (
          <>
            <Styles.Address>{truncateAddress(address)}</Styles.Address>
            <Avatar address={address} size="xxxl" />
          </>
        )}
      </Styles.Header>
      Profiles Coming Soon...
    </Styles.Root>
  );
};

const Styles = (() => {
  const Root = styled.div`
    ${textLgBlack};
    ${card};
    padding: ${(p) => p.theme.scale.two} ${(p) => p.theme.scale.four};
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-grow: 1;
    background-color: white;
  `;

  const Header = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: ${(p) => p.theme.scale.four};
  `;

  const Address = styled.h6`
    ${spaceMonoMdBold};
    display: flex;
    justify-content: center;
    text-overflow: ellipsis;
  `;

  const Button = styled(ButtonTertiary.Base)``;

  const Link = styled.a`
    ${spaceMonoMdBold};
    background-color: transparent;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: ${(p) => p.theme.scale.one} ${(p) => p.theme.scale.four};
    cursor: pointer;

    :hover {
      background-color: ${(p) => p.theme.colors.gray[100]};
    }

    :active {
      background-color: ${(p) => p.theme.colors.primary[200]};
    }
  `;

  return {
    Root,
    Header,
    Address,
    Button,
    Link,
  };
})();

// export const Menu = {
//   Closed: {
//     Root: styled(motion.ul)`
//       ${noScrollbars};
//       display: flex;
//       flex-direction: column;
//       flex-grow: 1;
//     `,

//     ProfileWrapper: styled.div`
//       margin-top: ${(p) => p.theme.scale.four};
//       display: flex;
//       flex-direction: row;
//       align-items: center;
//       justify-content: center;
//     `,
//   },

//   Open: {
//     Root: styled(motion.ul)`
//       ${noScrollbars};
//       display: flex;
//       flex-direction: column;
//       overflow-y: scroll;
//     `,

//     Header: styled.div`
//       display: flex;
//       flex-direction: row;
//       align-items: center;
//       padding: ${(p) => p.theme.scale.four};
//     `,

//     PrimaryButton: styled.button`
//       ${textLgBlack};
//       background-color: ${(p) => p.theme.colors.primary[100]};
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       height: ${(p) => p.theme.scale.twelve};
//       padding: ${(p) => p.theme.scale.two} ${(p) => p.theme.scale.four};
//       margin-top: ${(p) => p.theme.scale.two};
//       cursor: pointer;

//       :hover {
//         background-color: ${(p) => p.theme.colors.primary[200]};
//       }
//     `,

//     Profile: {
//       Root: styled.div`
//         display: flex;
//         flex-direction: column;
//         align-items: center;
//       `,

//       Avatar: styled.div`
//         margin-top: -2rem;
//         margin-bottom: ${(p) => p.theme.scale.four};
//         border: 3px solid black;
//         border-radius: 50%;
//       `,

//       Address: styled.h3`
//         ${spaceMonoXlBlack};
//         margin: ${(p) => p.theme.scale.four} 0;
//       `,
//     },

//     Auth: {
//       Root: styled.div`
//         display: flex;
//         flex-direction: column;
//         align-items: center;
//       `,

//       Relay: styled.div`
//         margin-top: -2rem;
//         margin-bottom: ${(p) => p.theme.scale.four};
//         border: 3px solid black;
//         border-radius: 50%;
//       `,
//     },
//   },

//   Link: styled.button`
//     ${textMdSemiBold};
//     background-color: transparent;
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     padding: ${(p) => p.theme.scale.one} ${(p) => p.theme.scale.four};
//     cursor: pointer;

//     :hover {
//       /* ${textLgBlack}; */
//       background-color: ${(p) => p.theme.colors.gray[100]};
//     }

//     :active {
//       background-color: ${(p) => p.theme.colors.primary[200]};
//     }
//   `,

//   PrimaryLink: styled.button`
//     ${spaceMonoLgBlack};
//     background-color: transparent;
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     padding: ${(p) => p.theme.scale.one} ${(p) => p.theme.scale.four};
//     cursor: pointer;

//     :hover {
//       background-color: ${(p) => p.theme.colors.gray[100]};
//     }

//     :active {
//       background-color: ${(p) => p.theme.colors.primary[200]};
//     }
//   `,
// };

// // <Menu.Open.Root>
//   {/* <Menu.Open.Header>
//     <Image
//       style={{ cursor: "pointer" }}
//       onClick={() => setRightPanelState({ id: "closed" })}
//       src="/exit.svg"
//       width={16}
//       height={16}
//       alt="close menu"
//     />
//   </Menu.Open.Header>
//   <Menu.Open.Profile.Root>
//     <Menu.Open.Profile.Avatar>
//       <Avatar address={activeConversation?.peerAddress || ""} size="xxxl" />
//     </Menu.Open.Profile.Avatar>
//     <Menu.Open.Profile.Address>
//       {truncateAddress(activeConversation?.peerAddress || "")}
//     </Menu.Open.Profile.Address>
//   </Menu.Open.Profile.Root>
//   <Menu.Open.PrimaryButton>Send A Message</Menu.Open.PrimaryButton> */}
// // </Menu.Open.Root>
