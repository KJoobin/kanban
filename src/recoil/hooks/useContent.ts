import React, { useRef, useState } from "react";

const DEBOUNCE = 300;

export const useContent: () => [string, { onChange: React.FormEventHandler<HTMLElement> }] = () => {
  const [ content, setContent ] = useState<string>("");
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const onChange:React.FormEventHandler<HTMLElement> = (e) => {
    const target = e.target as HTMLElement;
    const { textContent } = target;

    if(timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      setContent(textContent || "");
    }, DEBOUNCE)
  };

  return [ content, { onChange } ];
};
