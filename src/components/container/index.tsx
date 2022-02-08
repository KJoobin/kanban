import React from "react";

export const Container:React.FunctionComponent = ({ children }) => {
  return <div className={"min-h-screen flex flex-col"}>{children}</div>;
};
