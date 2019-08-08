import React from 'react';
import styled from 'styled-components';
import Task from '../task/task';
import {Droppable, Draggable} from 'react-beautiful-dnd';

const Container = styled.div`
  margin: 8px;
  border: 1px solid lightgrey;
  background-color: white;
  border-radius: 2px;
  width: 220px;

  display: flex;
  flex-direction: column;
`;
const Title = styled.h3`
  padding: 8px;
`;
const TaskList = styled.div`
  padding: 8px;
  background-color: ${({isDraggingOver}) =>
  isDraggingOver ? 'skyblue' : 'inherit'};
  transition: background-color 0.2s ease;
  flex-grow: 1;
  min-height: 100px;
`;

const Column = ({column, index, tasks, isDropDisabled}) => {
  return (
    <Draggable draggableId={column.id} index={index}>
      {(provided) => (
        <Container {...provided.draggableProps} ref={provided.innerRef}>
          <Title {...provided.dragHandleProps}>{column.title}</Title>
          <Droppable
            droppableId={column.id}
            // type={column.id === 'column-3' ? 'done' : 'active'} // запретить перетаскивать сюда
            isDropDisabled={isDropDisabled}
            type="task"
          >
            {(provided, snapshot) => (
              <TaskList
                ref={provided.innerRef}
                {...provided.droppableProps}
                isDraggingOver={snapshot.isDraggingOver}
              >
                {tasks.map(({id, content}, index) => (
                  <Task key={id} id={id} content={content} index={index}/>
                ))}
                {provided.placeholder}
              </TaskList>
            )}
          </Droppable>
        </Container>
      )}
    </Draggable>
  );
};

export default Column;
