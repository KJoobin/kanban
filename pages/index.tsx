import React, { useCallback, useEffect, useState } from "react";

import { Card, CardList } from "@components";
import { Task } from "@recoil/atoms";
import { Container } from "@components/container";
import { useContent, useTaskListMap } from "@recoil/hooks";

const Home: React.FC = () => {
  const [ taskListMap, { createTask, updateTask, updateTaskOrder, createTaskList } ] = useTaskListMap();
  const [ tempTask, setTempTask ] = useState<Pick<Task,"id" | "title" | "desc"> | null>();
  const [ title, { onChange: onChangeTitle } ] = useContent();
  const [ desc, { onChange: onChangeDesc } ] = useContent();

  const tempCardRef = useCallback((node: HTMLDivElement) => {
    if(!node || !node.hasChildNodes()) return;

    const titleElement = node.childNodes[0] as HTMLElement;
    titleElement.focus();
  },[])

  const onCreateCard = (listId: string) => {
    return () => {
      if(tempTask) {
        const { id: tempTaskId, ...taskInput } = tempTask;
        updateTask(tempTaskId, taskInput);
      }
      const task = createTask(listId, {});
      setTempTask(task);
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
  },[ title ])

  useEffect(() => {
    setTempTask(prevTempTask => {
      if(!prevTempTask) return null;
      return { ...prevTempTask, desc }
    })
  },[ desc ])


  const [ groupName, setGroupName ] = useState<string>("");
  const onChangeGroup:React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setGroupName(e.target.value);
  }
  const onSubmitGroupForm:React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if(groupName === "") return;
    
    createTaskList({ title: groupName, status: groupName });
    setGroupName("")
  }
  return (
    <Container>
      <main className={"flex"}>
        {taskListMap.map(({ id, status: taskStatus, title, tasks })=> {
          return <CardList className={"mx-1 my-1"} key={taskStatus} title={title} onCreateCard={onCreateCard(id)}>
            {[ ...tasks.values() ].map((card) => {
              return <Card
                key={card.id}
                ref={tempCardRef}
                className={"my-2"}
                status={taskStatus}
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

        <form onSubmit={onSubmitGroupForm}>
          <input 
            className={"border-solid border border-gray-500 rounded-lg pl-1"} 
            type={"text"} 
            placeholder={"새 그룹 이름"} 
            value={groupName}
            onChange={onChangeGroup}
          />
          <button className={"px-4 py-1 hover:bg-gray-300"} type={"submit"}>{"+"}</button>
        </form>
      </main>
    </Container>
  );
};

export default Home;
