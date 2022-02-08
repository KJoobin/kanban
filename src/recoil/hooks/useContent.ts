import React from "react";
import { useRecoilState } from "recoil";

import { contentState } from "@recoil/atoms";

export const useContent: () => [string, { onChange: React.FormEventHandler<HTMLElement> }] = () => {
  const [content, setContent] = useRecoilState<string>(contentState);

  const onChange:React.FormEventHandler<HTMLElement> = (e) => {
    const target = e.target as HTMLElement;
    const { textContent } = target;

    setContent(textContent || "");
  };

  return [content, { onChange }];
};
