import React, { FC } from "react";
import { attachPropertiesToComponent } from "utils/attachPropertiesToComponent";
import { renderImperatively } from "@/utils/render-imperatively";

export type DialogShowHandler = {
  close: () => void;
};

const closeFnSet = new Set<() => void>();

type ShowComponentProp<T> = T extends {
  visible: boolean;
  duration?: number;
  onClose?: () => void;
}
  ? Omit<T, "visible">
  : never;

function withShow<T>(Component: FC<T>) {
  return (props?: ShowComponentProp<T>) => {
    const { onClose } = props || {};
    const handler: DialogShowHandler = renderImperatively(
      // @ts-ignore
      <Component
        {...props}
        onClose={() => {
          closeFnSet.delete(handler.close);
          onClose?.();
        }}
      />
    );
    closeFnSet.add(handler.close);

    return handler;
  };
}

export default function withShowFn<T>(Component: FC<T>) {
  return attachPropertiesToComponent(Component, {
    show: withShow(Component),
  });
}
