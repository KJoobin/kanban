import React from "react";

import { ComponentMeta, ComponentStory } from "@storybook/react";

import { Card as CardComponent } from "./index";
import { TaskStatus } from "@recoil/atoms";

export default {
  title: "Components/Card",
  component: CardComponent,
  argTypes: {
    status: {
      options: Object.entries(TaskStatus).reduce((acc, cur) => {
        const key = cur[0] as keyof TaskStatus;
        const value = cur[1];
        return { ...acc, [key]: value };
      }, {} as Record<keyof TaskStatus, string>),
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
    status: TaskStatus.BACKLOG,
    title: "Title",
    description: "Description",
  },
} as ComponentMeta<typeof CardComponent>;

export const Card: ComponentStory<typeof CardComponent> = (props) => {
  return <CardComponent {...props}/>;
};
