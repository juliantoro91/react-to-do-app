import React from "react";
import { useLocalStorage } from "./useLocalStorage";
import { alternateColorGenerator } from "../AlternateColorGenerator/AlternateColorGenerator";

const TodoContext = React.createContext();

function TodoProvider(props) {

    // STATES
    const {
        item: todos,
        saveItem: saveTodos,
        loading,
        error
    } = useLocalStorage('TODOS_V1', []);
    const [searchValue, setSearchValue] = React.useState(''); // For search bar
    const [openModal, setOpenModal] = React.useState(false);

    // TODOS COUNTERS
    const tasksState = {
        completedTasks: todos.filter(todo => (todo.completed)).length,
        totalTasks: todos.length,
    }

    // SEARCH FILTER LOGIC
    const searchedTodos = todos.filter(
        todo => (todo.text.toLowerCase().includes(searchValue.toLowerCase()))); // To filter todos by search criteria
    
    let matchedSearchLabel = searchedTodos.length + " coincidences"; // To update search side label

    // COLOR ASIGNER
    const getColor = alternateColorGenerator();
    todos.forEach(todo => {
        todo.color = getColor.next().value;
    });

    // SIDE FUNCTIONS
    const todoComplete = (text) => {
        const index = todos.findIndex(todo => todo.text === text);
        const newTodos = [...todos];

        (newTodos[index].completed) ?
            newTodos[index].deleted = true :
            newTodos[index].completed = true ;

        saveTodos(newTodos);
    }

    const todoDelete = (text) => {
        const index = todos.findIndex(todo => todo.text === text);
        const newTodos = [...todos];

        (newTodos[index].completed) ?
            newTodos[index].completed = false :
            newTodos[index].deleted = true ;

        saveTodos(newTodos);
    }

    const todoAdd = (text) => {
        const newTodos = [...todos];

        if (text !== "") {
            newTodos.push(
                {
                    text,
                    completed: false,
                    deleted: false,
                }
            );
        }

        saveTodos(newTodos);
    }
    
    return (
        <TodoContext.Provider value={{
            loading,
            error,
            tasksState,
            searchValue,
            setSearchValue,
            matchedSearchLabel,
            searchedTodos,
            todoComplete,
            todoDelete,
            todoAdd,
            openModal,
            setOpenModal,
        }}>
            {props.children}
        </TodoContext.Provider>
    )
}

export { TodoContext, TodoProvider };