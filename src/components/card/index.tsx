import React from "react";

export enum CardStatus {
  BACKLOG = "backlog",
  IN_PROGRESS = "inProgress",
  DONE = "done",
}

interface CardProps {
  status: CardStatus;
  title?: string;
  description?: string;
}

export const Card: React.FC<CardProps> = React.memo(({
  title = "",
  description = "",
}) => {
  return (
    <div className={"card"}>
      <div>
        <span>
          제목 : {title}
        </span>
      </div>
      <div>
        <span className={""}>
          설명 : {description}
        </span>
      </div>
    </div>
  );
});
