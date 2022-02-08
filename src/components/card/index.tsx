import React from "react";

export enum CardStatus {
  BACKLOG = "backlog",
  IN_PROGRESS = "inProgress",
  DONE = "done",
}

interface CardProps extends React.HTMLAttributes<HTMLElement>{
  status: CardStatus;
  title?: string;
  description?: string;
}

export const Card: React.FC<CardProps> = React.memo(({
  title = "",
  description = "",
  className,
  ...props
}) => {
  return (
    <div className={`card bg-white prose ${className}`} {...props}>
      <h2 className={"h1"}>{title}</h2>
      <p>{description}</p>
    </div>
  );
});
