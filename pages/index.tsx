import React, { useCallback, useState } from "react";

import { Card, CardList } from "@components";
import { Task, TaskStatus } from "@recoil/atoms";
import { Container } from "@components/container";
import { useTask } from "@recoil/hooks";

const Home: React.FC = () => {
  const [taskList, { createTask, updateTask }] = useTask();
  const [tempTask, setTempTask] = useState<Pick<Task,"id" | "status" | "title" | "desc"> | null>();

  const onCreateCard = (status:Task["status"]) => {
    return () => {
      if(tempTask) {
        const { id: tempTaskId, ...taskInput } = tempTask;
        updateTask(tempTaskId, taskInput);
      }
      const id = createTask({ status });
      setTempTask({ id, status });
    }
  }

  const tempCardRef = useCallback((node: HTMLDivElement) => {
    if(!node || !node.hasChildNodes()) return;

    const titleElement = node.childNodes[0] as HTMLElement;
    titleElement.focus();
  },[])

  const onKeyDown:React.KeyboardEventHandler<HTMLElement> = (e) => {
    // mac: metaKey, window: altKey
    if(e.key !== "Enter" || !tempTask) return;
    if(e.shiftKey) return;

    const { id, ...taskInput } = tempTask;
    updateTask(id, { ...taskInput });
    setTempTask(null);
  }

  return (
    <Container>
      <main>
        <CardList title={"백 로그"} onCreateCard={onCreateCard(TaskStatus.BACKLOG)}>
          {Object.values(taskList).map((card) => {
            return <Card
              key={card.id}
              ref={tempCardRef}
              className={"my-2"}
              status={TaskStatus.BACKLOG}
              title={card.title}
              description={card.desc}
              contentEditable={tempTask?.id === card.id}
              onKeyDown={onKeyDown}
            />
          })}
        </CardList>
        
      </main>
    </Container>
  );
};

export default Home;
