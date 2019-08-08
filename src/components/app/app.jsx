import React, {useState} from 'react';
import './app.css';
import styled from 'styled-components';
import initialData from '../../initialData';
import Column from '../column/column';
import {DragDropContext, Droppable} from 'react-beautiful-dnd';

const Container = styled.div`
  display: flex;
`;

const App = () => {
  const [state, setState] = useState(initialData);

  const onDragStart = start => {
    // document.body.style.color = 'orange';
    // document.body.style.transition = 'background-color 0.2s ease';

    // Перемещаем элементы только слева направо
    const homeIndex = state.columnOrder.indexOf(start.source.droppableId);

    setState({...state, homeIndex});
  };

  const onDragUpdate = update => {
    // const {destination} = update;
    // const opacity = destination ? destination.index / Object.keys(state.tasks).length : 0;
    // document.body.style.backgroundColor = `rgba(153, 141, 217, ${opacity})`;
  };

  const onDragEnd = result => {
    // document.body.style.color = 'inherit';
    // document.body.style.backgroundColor = 'inherit';

    // console.log(result);

    // Перемещаем элементы только слева направо
    setState({
      ...state,
      homeIndex: null
    });

    const {destination, source, draggableId, type} = result;

    // Если бросили элемент за пределами области то не делаем ничего
    if (!destination) return;

    // Если бросили элемент там же где и подняли, то не делаем ничего
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Если перемещаем колонку, а не таску
    if (type === 'column') {
      const newColumnOrder = [...state.columnOrder];
      newColumnOrder.splice(source.index, 1);
      newColumnOrder.splice(destination.index, 0, draggableId);

      const newState = {
        ...state,
        columnOrder: newColumnOrder
      };

      setState(newState);
      return;
    }

    // Выбираем ту колонку, в которой происходило действие
    const start = state.columns[source.droppableId];

    // Выбираем ту колонку, в которой завершилось действие
    const finish = state.columns[destination.droppableId];

    // Если колонка не поменялась, то...
    if (start === finish) {
      // Делаем копию taskIds taskIds: ['task-1', 'task-2'...]
      const newTaskIds = [...start.taskIds];

      // Удаляем id перетаскиваемого элемента с того места, где он находился
      newTaskIds.splice(source.index, 1);
      // Кладем id перетаскиваемого элемента на то место, где мы отпустили элемент
      newTaskIds.splice(destination.index, 0, draggableId);

      // Делаем поверхностную копию исходной колонки
      const newColumn = {
        ...start,
        taskIds: newTaskIds
      };

      // Создаем обновленное состояние
      const newState = {
        ...state,
        columns: {
          ...state.columns,
          [newColumn.id]: newColumn
        }
      };

      // Установим обновленное состояник
      setState(newState);
      return;
    }

    // Если перетащили в другую колонку, то...
    // УДАЛЯЕМ таску из массива с id-ишками тасок
    // и обновляем коллонку ОТКУДА перетащили
    const startTaskIds = [...start.taskIds];
    startTaskIds.splice(source.index, 1);
    const newStart = {
      ...start,
      taskIds: startTaskIds
    };

    // Добавляем таску в массив с id-ишками тасок
    // и обновляем коллонку КУДА перетащили
    const finishTaskIds = [...finish.taskIds];
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinish = {
      ...finish,
      taskIds: finishTaskIds
    };

    // Обновляем состояние с учетом изменений колонок
    const newState = {
      ...state,
      columns: {
        ...state.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish
      }
    };

    setState(newState);
  };

  return (
    <DragDropContext
      onDragEnd={onDragEnd}
      onDragStart={onDragStart}
      onDragUpdate={onDragUpdate}
    >
      <Droppable droppableId="all columns" direction="horizontal" type="column">
        {(provided) => (
          <Container {...provided.droppableProps} ref={provided.innerRef}>
            {state.columnOrder.map((columnId, index) => {
              const column = state.columns[columnId];
              const tasks = column.taskIds.map(taskId => state.tasks[taskId]);

              // Перемещаем элементы только слева направо
              const isDropDisabled = index < state.homeIndex;

              return (
                <Column
                  key={column.id}
                  column={column}
                  tasks={tasks}
                  isDropDisabled={isDropDisabled}
                  index={index}
                />
              );
            })}
            {provided.placeholder}
          </Container>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default App;
