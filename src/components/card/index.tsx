import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLElement>{
  status: string;
  title?: string;
  description?: string;
  contentEditable?: boolean;
  onChangeTitle?: React.FormEventHandler<HTMLHeadingElement>;
  onChangeDesc?: React.FormEventHandler<HTMLHeadingElement>;
}

export const Card = React.memo(React.forwardRef<HTMLDivElement, CardProps>(({
  title = "",
  description = "",
  className,
  contentEditable = false,
  onChangeTitle,
  onChangeDesc,
  ...props
}, ref) => {
  return (
    <div ref={ref} className={`card prose ${className}`} draggable={!contentEditable} {...props}>
      <h2 placeholder={contentEditable ? "제목을 입력하세요" : "제목 없음"} contentEditable={contentEditable} onInput={onChangeTitle}>{title}</h2>
      <p className={"text-gray-500"} placeholder={contentEditable ? "설명을 입력하세요" : ""} contentEditable={contentEditable} onInput={onChangeDesc}>{description}</p>
    </div>
  );
}));
