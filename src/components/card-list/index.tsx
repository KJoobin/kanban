import React from "react";

interface CardListProps extends React.HTMLAttributes<HTMLElement>{
  title: string;
  onCreateCard: () => void;
}

export const CardList: React.FC<CardListProps> = React.memo(({
  title,
  onCreateCard,
  className,
  children
}) => {
  return (
    <article className={`w-full bg-gray-200 py-3 px-4 ${className}`}>
      <header className={"py-3 px-2"}>
        <h2>{title}</h2>
      </header>
      
      <section>
        {children}
      </section>

      <button type={"button"} className={"w-full py-2 px-2 my-3 text-left hover:bg-gray-300"} onClick={onCreateCard}>
        {"새 카드 만들기"}
      </button>
    </article>
  );
});
