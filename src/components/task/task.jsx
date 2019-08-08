import React from 'react';
import styled from 'styled-components';
import { Draggable } from 'react-beautiful-dnd';

const Container = styled.div`
  border: 1px solid lightgrey;
  border-radius: 2px;
  padding: 8px;
  margin-bottom: 8px;
  background-color: ${({ isDragging, isDragDisabled }) =>
    isDragDisabled ? 'lightgrey' : isDragging ? 'lightgreen' : 'white'};
  transition: background-color 0.1s ease;
  display: flex;
`;

const Handle = styled.div`
  width: 20px;
  height: 20px;
  background-color: orange;
  border-radius: 4px;
  margin-right: 8px;
`;

const Task = ({ id, content, index }) => {
  const isDragDisabled = id === 'task-1'; // Если true то запретит перетаскивать этот элемент

  return (
    <Draggable draggableId={id} index={index} isDragDisabled={isDragDisabled}>
      {(provided, snapshot) => {
        return (
          <Container
            ref={provided.innerRef}
            {...provided.draggableProps}
            isDragging={snapshot.isDragging} // Стили во время перетаскивания
            isDragDisabled={isDragDisabled} // Смотри выше
          >
            <Handle {...provided.dragHandleProps} /> {/*За что перетаскиваем*/}
            {content}
          </Container>
        );
      }}
    </Draggable>
  );
};

export default Task;
