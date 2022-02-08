import React from "react";

import { ComponentMeta, ComponentStory } from "@storybook/react";

import { Card as CardComponent, CardStatus } from "./index";

export default {
  title: "Components/Card",
  component: CardComponent,
  argTypes: {
    status: {
      options: Object.entries(CardStatus).reduce((acc, cur) => {
        const key = cur[0] as keyof CardStatus;
        const value = cur[1];
        return { ...acc, [key]: value };
      }, {} as Record<keyof CardStatus, string>),
      control: { type: "radio" },
      description: "칸반보드 에서의 카드 상태",
    },
    title: {
      control: { type: "text" },
      description: "테스크 제목",
    },
    description: {
      control: { type: "text" },
      description: "테스크 설명",
    },
  },
  args: {
    status: CardStatus.BACKLOG,
    title: "Title",
    description: "Description",
  },
} as ComponentMeta<typeof CardComponent>;

export const Card: ComponentStory<typeof CardComponent> = (props) => {
  return <CardComponent {...props}/>;
};
