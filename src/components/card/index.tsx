import React from "react";
import { TaskStatus } from "@recoil/atoms";

interface CardProps extends React.HTMLAttributes<HTMLElement>{
  status: TaskStatus;
  title?: string;
  description?: string;
  contentEditable?: boolean;
}

export const Card: React.FC<CardProps> = React.memo(({
  title = "",
  description = "",
  className,
  contentEditable = false,
  ...props
}) => {
  return (
    <div className={`card prose ${className}`} {...props}>
      <h2 className={"h1"} placeholder={contentEditable ? "제목을 입력하세요" : "제목 없음"} contentEditable={contentEditable}>{title}</h2>
      <p className={"text-gray-500"} placeholder={contentEditable ? "설명을 입력하세요" : ""} contentEditable={contentEditable}>{description}</p>
    </div>
  );
});
