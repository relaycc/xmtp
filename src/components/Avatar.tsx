import { useEffect, useState, useRef, FunctionComponent, useMemo } from "react";
import { useInView } from "@/hooks/useInView";
import { AsyncState } from "@/lib/AsyncState";
import { create } from "zustand";
import { motion } from "framer-motion";
import { Alchemy } from "@/lib/Alchemy";
import styled, { css } from "styled-components";
import Blockies from "react-blockies";

const useAvatarStore = create<Record<string, AsyncState<string | null>>>(
  () => ({})
);

type Identity<T> = (x: T) => T;

export const useAvatar = ({ address }: { address: string }) => {
  const avatar = useAvatarStore((state) => state[address]) || { id: "idle" };

  const setAvatar = (
    input: AsyncState<string | null> | Identity<AsyncState<string | null>>
  ) => {
    useAvatarStore.setState((state) => {
      return {
        ...state,
        [address]: typeof input === "function" ? input(state[address]) : input,
      };
    });
  };

  return [avatar, setAvatar] as const;
};

export const Avatar: FunctionComponent<{
  address: string;
  onClick?: () => unknown;
  size: "sm" | "md" | "lg" | "xl" | "xxxl" | "xxxxl";
}> = ({ address, onClick, size }) => {
  const ref = useRef(null);
  const isInView = useInView(ref);
  const [avatar, setAvatar] = useAvatar({ address });
  const [inViewForASecond, setInViewForASecond] = useState(false);
  const [inViewForASecondTimer, setInViewForASecondTimer] =
    useState<NodeJS.Timeout>();

  useEffect(() => {
    if (!isInView) {
      if (inViewForASecondTimer === undefined) {
        return;
      } else {
        clearTimeout(inViewForASecondTimer);
        setInViewForASecondTimer(undefined);
      }
    } else {
      if (inViewForASecondTimer !== undefined) {
        return;
      } else {
        setInViewForASecondTimer(
          setTimeout(() => {
            setInViewForASecond(true);
          }, 2000)
        );
      }
    }
  }, [isInView, inViewForASecondTimer]);

  useEffect(() => {
    if (!inViewForASecond || avatar.id !== "idle") {
      return;
    } else {
      (async () => {
        try {
          setAvatar({ id: "pending" });
          const avatar = await Alchemy.getAvatar(address);
          setAvatar({ id: "success", data: avatar });
        } catch (error) {
          setAvatar({ id: "error", error });
        }
      })();
    }
  }, [inViewForASecond, avatar.id, address]);

  const AvatarElement = useMemo(() => {
    switch (size) {
      case "sm":
        return AvatarStyles.Sm;
      case "md":
        return AvatarStyles.Md;
      case "lg":
        return AvatarStyles.Lg;
      case "xl":
        return AvatarStyles.Xl;
      case "xxxl":
        return AvatarStyles.Xxxl;
      case "xxxxl":
        return AvatarStyles.Xxxxl;
      default:
        throw new Error("Invalid Avatar size");
    }
  }, [size]);

  const blockie = useMemo(() => {
    switch (size) {
      case "sm":
        return {
          component: AvatarStyles.Blockie.Sm,
          seed: address || "no address",
          size: 10,
          scale: 2.5,
        };
      case "md":
        return {
          component: AvatarStyles.Blockie.Md,
          seed: address || "no address",
          size: 10,
          scale: 4,
        };
      case "lg":
        return {
          component: AvatarStyles.Blockie.Lg,
          seed: address || "no address",
          size: 10,
          scale: 5,
        };
      case "xl":
        return {
          component: AvatarStyles.Blockie.Xl,
          seed: address || "no address",
          size: 10,
          scale: 8,
        };
      case "xxxl":
        return {
          component: AvatarStyles.Blockie.Xxxl,
          seed: address || "no address",
          size: 16,
          scale: 16,
        };
      case "xxxxl":
        return {
          component: AvatarStyles.Blockie.Xxxl,
          seed: address || "no address",
          size: 28,
          scale: 16,
        };
      default:
        throw new Error("Invalid Avatar size");
    }
  }, [address, size]);

  const whenHasAvatar = typeof avatar.data === "string";
  const whenDoesntHaveAvatar = typeof avatar.data !== "string";

  return (
    <>
      {whenDoesntHaveAvatar && (
        <div
          ref={ref}
          onClick={onClick}
          style={{
            borderRadius: "50%",
            opacity: avatar.id === "pending" ? 0.2 : 1,
            display: "flex",
          }}
        >
          <blockie.component
            seed={blockie.seed}
            size={blockie.size}
            scale={blockie.scale}
          />
        </div>
      )}
      {whenHasAvatar && (
        <AvatarElement
          initial={{ opacity: 0.2 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0 }}
          onClick={onClick}
          src={(() => {
            return avatar.data || "NO ADDRESS";
          })()}
          alt="user"
        />
      )}
    </>
  );
};

const avatar = css`
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.1s ease-in-out;
`;

const Pending = styled(motion.div)`
  min-width: 40px;
  min-height: 40px;
  border-radius: 50%;
  background-color: ${(p) => p.theme.colors.primary[400]};
`;

const SIZES = {
  sm: css`
    height: 25px;
    min-width: 25px;
  `,

  md: css`
    height: 2.5rem;
    min-width: 2.5rem;
  `,

  lg: css`
    height: 50px;
    min-width: 50px;
  `,

  xl: css`
    border-radius: 1rem;
    height: 5rem;
    min-width: 5rem;
  `,

  xxxl: css`
    height: 16rem;
    min-width: 16rem;
  `,

  xxxxl: css`
    height: 20rem;
    min-width: 20rem;
  `,
};

export const AvatarStyles = {
  Sm: styled(motion.img)`
    ${avatar};
    ${SIZES.sm};
  `,

  Md: styled(motion.img)`
    ${avatar};
    ${SIZES.md};
  `,

  Lg: styled(motion.img)`
    ${avatar};
    ${SIZES.lg};
  `,
  Xl: styled(motion.img)`
    ${avatar};
    ${SIZES.xl};
  `,

  Xxxl: styled(motion.img)`
    ${avatar};
    ${SIZES.xxxl};
  `,

  Xxxxl: styled(motion.img)`
    ${avatar};
    ${SIZES.xxxxl};
  `,

  Blockie: {
    Sm: styled(Blockies)`
      ${avatar};
      ${SIZES.md};
    `,

    Md: styled(Blockies)`
      ${avatar};
      ${SIZES.md};
    `,

    Lg: styled(Blockies)`
      ${avatar};
      ${SIZES.lg};
    `,

    Xl: styled(Blockies)`
      ${avatar};
      ${SIZES.xl};
    `,

    Xxxl: styled(Blockies)`
      ${avatar};
      ${SIZES.xxxl};
    `,

    Xxxxl: styled(Blockies)`
      ${avatar};
      ${SIZES.xxxxl};
    `,
  },

  Pending: {
    Md: ({ i }: { i: number }) => {
      return (
        <Pending
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{
            repeat: Infinity,
            delay: 0.1 * (i + 1),
            duration: 0.75,
            repeatType: "reverse",
          }}
        />
      );
    },
  },
};
