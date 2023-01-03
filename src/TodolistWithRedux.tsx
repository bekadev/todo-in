import React, {ChangeEvent, memo, useCallback} from 'react';
import {TodolistType} from './App';
import {EditableSpan} from './EditableSpan';
import IconButton from '@mui/material/IconButton/IconButton';
import {Delete} from '@mui/icons-material';
import {AddItemForm} from './AddItemForm';
import {Button, Checkbox} from '@mui/material';
import {useDispatch, useSelector} from 'react-redux';
import {AppRootStateType} from './state/store';
import {TaskType} from './Todolist';
import {changeTodolistFilterAC, changeTodolistTitleAC, removeTodolistAC} from './state/todolists-reducer';
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC} from './state/tasks-reducer';
import {FilterValuesType} from './AppWithRedux';

type TodolistWithReduxPropsType = {
    todolist: TodolistType
}

export const TodolistWithRedux = memo( ({todolist}: TodolistWithReduxPropsType) => {
    console.log('todolist')

    const {id, title, filter} = todolist

    let tasks = useSelector<AppRootStateType, Array<TaskType>>(state => state.tasks[id])

    if (filter === "active") {
        tasks = tasks.filter(t => !t.isDone);
    }
    if (filter === "completed") {
        tasks = tasks.filter(t => t.isDone);
    }

    const dispatch = useDispatch()

    const changeTodolistTitle = useCallback( (title: string) => {
        dispatch(changeTodolistTitleAC(id, title))
    }, [dispatch])

    const removeTodolist = useCallback( () => {
        dispatch(removeTodolistAC(id))
    }, [dispatch])

    const addTask = useCallback( (title: string) => {
        dispatch(addTaskAC(title,id))
    }, [dispatch])

    const changeFilter = useCallback( (value: FilterValuesType, todolistId: string) => {
        dispatch(changeTodolistFilterAC(todolistId, value))
    }, [dispatch])

    const FilterClickHandler = useCallback(  (filter: FilterValuesType) =>  () => dispatch(changeTodolistFilterAC(id, filter)), [dispatch])

    return <div>
        <h3> <EditableSpan value={title} onChange={changeTodolistTitle} />
            <IconButton onClick={removeTodolist}>
                <Delete />
            </IconButton>
        </h3>
        <AddItemForm addItem={addTask}/>
        <div>
            {
                tasks.map(t => {
                    const onClickHandler = () => dispatch(removeTaskAC(t.id, id))
                    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
                        let newIsDoneValue = e.currentTarget.checked;
                        dispatch(changeTaskStatusAC(t.id, newIsDoneValue, id))

                    }
                    const onTitleChangeHandler = (newValue: string) => {
                        dispatch(changeTaskTitleAC(t.id,newValue,id))
                    }


                    return <div key={t.id} className={t.isDone ? "is-done" : ""}>
                        <Checkbox
                            checked={t.isDone}
                            color="primary"
                            onChange={onChangeHandler}
                        />

                        <EditableSpan value={t.title} onChange={onTitleChangeHandler} />
                        <IconButton onClick={onClickHandler}>
                            <Delete />
                        </IconButton>
                    </div>
                })
            }
        </div>
        <div>
            <Button variant={filter === 'all' ? 'outlined' : 'text'}
                    onClick={FilterClickHandler('all')}
                    color={'inherit'}
            >All
            </Button>
            <Button variant={filter === 'active' ? 'outlined' : 'text'}
                    onClick={FilterClickHandler('active')}
                    color={'primary'}>Active
            </Button>
            <Button variant={filter === 'completed' ? 'outlined' : 'text'}
                    onClick={FilterClickHandler('completed')}
                    color={'secondary'}>Completed
            </Button>
        </div>
    </div>
});
