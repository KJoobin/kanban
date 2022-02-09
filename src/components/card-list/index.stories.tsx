import React from "react";

import { ComponentMeta, ComponentStory } from "@storybook/react";

import { CardList as CardListComponent } from "./index";
import { Card } from "@components";

export default {
  title: "Components/Card List",
  component: CardListComponent,
  argTypes: {
    title: {
      control: { type: "text" },
      description: "리스트 제목",
    },
  },
  args: {
    title: "리스트 제목",
  },
} as ComponentMeta<typeof CardListComponent>;

const Template: ComponentStory<typeof CardListComponent> = (props) => {
  return <CardListComponent {...props}/>;
};

export const CardList = Template.bind({});

export const CardListWithCard = Template.bind({});
CardListWithCard.args = {
  children:<>
    <Card status={"backlog"} title={"할일"} description={"해야할 일"} className={"my-2"}/>
    <Card status={"backlog"} title={"할일1"} description={"해야할 일1"} className={"my-2"}/>
  </>
}

