import React, { FC } from "react";
import { attachPropertiesToComponent } from "utils/attachPropertiesToComponent";
import { renderImperatively } from "@/utils/render-imperatively";

export type DialogShowHandler = {
  close: () => void;
};

const closeFnSet = new Set<() => void>();

type ShowComponentProp<T> = T extends {
  visible: boolean;
  onClose?: () => void;
}
  ? Omit<T, "visible">
  : never;

type DefaultComponentProps = {
  onClose: () => void;
};

function withShow<T>(Component: FC<DefaultComponentProps>) {
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

export default function withShowFn(Component: FC<DefaultComponentProps>) {
  return attachPropertiesToComponent(Component, {
    show: withShow(Component),
  });
}
