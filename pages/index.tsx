import React, { useCallback, useEffect, useState } from "react";

import { Card, CardList } from "@components";
import { Task, TaskStatus } from "@recoil/atoms";
import { Container } from "@components/container";
import { useContent, useTask } from "@recoil/hooks";

const taskStatus = [
  { status: TaskStatus.BACKLOG, title: "백 로그" },
  { status: TaskStatus.IN_PROGRESS, title: "진행중" },
  { status: TaskStatus.DONE, title: "완료" },
]

const Home: React.FC = () => {
  const [taskList, { createTask, updateTask }] = useTask();
  const [tempTask, setTempTask] = useState<Pick<Task,"id" | "status" | "title" | "desc"> | null>();
  const [title, { onChange: onChangeTitle }] = useContent();
  const [desc, { onChange: onChangeDesc }] = useContent();

  const tempCardRef = useCallback((node: HTMLDivElement) => {
    if(!node || !node.hasChildNodes()) return;

    const titleElement = node.childNodes[0] as HTMLElement;
    titleElement.focus();
  },[])

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

  const onKeyDown:React.KeyboardEventHandler<HTMLElement> = (e) => {
    if(e.key !== "Enter" || !tempTask) return;
    if(e.shiftKey) return;

    const { id, ...taskInput } = tempTask;
    updateTask(id, { ...taskInput });
    setTempTask(null);
  }
  
  useEffect(() => {
    setTempTask(prevTempTask => {
      if(!prevTempTask) return null;
      return { ...prevTempTask, title }
    })
  },[title])

  useEffect(() => {
    setTempTask(prevTempTask => {
      if(!prevTempTask) return null;
      return { ...prevTempTask, desc }
    })
  },[desc])


  return (
    <Container>
      <main className={"flex"}>
        {taskStatus.map(({ status:taskStatus, title })=> {
          return <CardList key={taskStatus} title={title} onCreateCard={onCreateCard(taskStatus)}>
            {Object.values(taskList).filter(card => card.status === taskStatus).map((card) => {
              return <Card
                key={card.id}
                ref={tempCardRef}
                className={"my-2"}
                status={TaskStatus.BACKLOG}
                title={card.title}
                description={card.desc}
                contentEditable={tempTask?.id === card.id}
                onChangeTitle={onChangeTitle}
                onChangeDesc={onChangeDesc}
                onKeyDown={onKeyDown}
              />
            })}
          </CardList>
          
        })}
        
      </main>
    </Container>
  );
};

export default Home;
