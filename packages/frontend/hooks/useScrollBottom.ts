/* eslint-disable no-redeclare */
import { MutableRefObject, useEffect, useState } from "react";

interface IProp<R> {
  ref?: MutableRefObject<R | undefined | null>;
  onScrollBottom?: () => void;
}

// const defaultRef = {
//   current: document.getElementById("app"),
// };

/**
 * Check scroll.
 */
type CallBack = () => void;

function useScrollBottom<R extends HTMLDivElement>(options?: IProp<R>);
function useScrollBottom<R extends HTMLDivElement>(
  cb?: CallBack,
  targetRef?: MutableRefObject<R | undefined | null>
);

function useScrollBottom<R extends HTMLDivElement>(
  options?: IProp<R> | CallBack,
  targetRef?: MutableRefObject<R | undefined | null>
) {
  let cb: (() => void) | undefined;
  let ref;
  if (options) {
    if (typeof options === "function") {
      cb = options;
    } else if (Object.prototype.toString.call(options) === "[object Object]") {
      ref = options.ref;
      cb = options.onScrollBottom;
    }
  }
  if (targetRef) {
    ref = targetRef;
  }
  if (!ref) {
    ref = {
      current: document.getElementById("app"),
    };
  }
  const [isScrollBottom, setIsScrollBottom] = useState<boolean>(false);

  useEffect(() => {
    const onScroll = () => {
      const { current } = ref;
      if (current) {
        // 在高度变化了之后如果isScrollBottom没有变化，可以使用scrollTop = 0来重新触发触底监听
        if (current.scrollTop === 0) setIsScrollBottom(false);
        else {
          setIsScrollBottom(
            current.scrollTop >=
              current.scrollHeight - current.clientHeight - 100
          );
        }
      }
    };

    const { current } = ref;
    if (current?.addEventListener) {
      current.addEventListener("scroll", onScroll);
    }

    return () => {
      if (current?.removeEventListener) {
        current.removeEventListener("scroll", onScroll);
      }
    }; // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref.current]);

  useEffect(() => {
    if (isScrollBottom && cb) {
      cb();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isScrollBottom]);

  return [isScrollBottom];
}

export default useScrollBottom;
