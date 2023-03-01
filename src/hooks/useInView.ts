import { inView, InViewOptions } from "@motionone/dom";
import { RefObject, useEffect, useState } from "react";

interface UseInViewOpts extends Omit<InViewOptions, "root" | "amount"> {
  root?: RefObject<Element>;
  once?: boolean;
  amount?: "some" | "all" | number;
}

export const useInView = (
  ref: RefObject<Element>,
  { root, margin, amount, once = false }: UseInViewOpts = {}
) => {
  const [isInView, setInView] = useState(false);

  useEffect(() => {
    if (!ref.current || (once && isInView)) return;

    const onEnter = () => {
      setInView(true);

      return once ? undefined : () => setInView(false);
    };

    const options: InViewOptions = {
      root: (root && root.current) || undefined,
      margin,
      amount: amount === "some" ? "any" : amount,
    };

    return inView(ref.current, onEnter, options);
  }, [root, ref, margin, once, amount]);

  return isInView;
};
