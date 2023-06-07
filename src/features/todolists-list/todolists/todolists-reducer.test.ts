import {
    FilterValuesType,
    TodolistDomainType,
    todolistsActions,
    todolistsReducer,
    todolistsThunk,
} from "features/todolists-list/todolists/todolists-reducer";
import { v1 } from "uuid";
import { TodolistType } from "features/todolists-list/todolists/todolists-api";
import { RequestStatusType } from "app/app-reducer";

let todolistId1: string;
let todolistId2: string;
let startState: Array<TodolistDomainType> = [];

beforeEach(() => {
    todolistId1 = v1();
    todolistId2 = v1();
    startState = [
        {
            id: todolistId1,
            title: "What to learn",
            filter: "all",
            entityStatus: "idle",
            addedDate: "",
            order: 0,
        },
        {
            id: todolistId2,
            title: "What to buy",
            filter: "all",
            entityStatus: "idle",
            addedDate: "",
            order: 0,
        },
    ];
});

test("correct todolist should be removed", () => {
    const endState = todolistsReducer(
        startState,
        todolistsThunk.removeTodolist.fulfilled({ id: todolistId1 }, "requiredId", todolistId1)
    );

    expect(endState.length).toBe(1);
    expect(endState[0].id).toBe(todolistId2);
});

test("correct todolist should be added", () => {
    let todolist: TodolistType = {
        title: "New todolist",
        id: "any id",
        addedDate: "",
        order: 0,
    };

    const endState = todolistsReducer(
        startState,
        todolistsThunk.addTodolist.fulfilled({ todolist }, "requiredId", {
            title: todolist.title,
        })
    );

    expect(endState.length).toBe(3);
    expect(endState[0].title).toBe(todolist.title);
    expect(endState[0].filter).toBe("all");
});

test("correct todolist should change its name", () => {
    let newTodolistTitle = "New todolist";

    const action = todolistsThunk.changeTodolistTitle.fulfilled(
        {
            id: todolistId2,
            title: newTodolistTitle,
        },
        "requiredId",
        { title: newTodolistTitle, id: todolistId2 }
    );

    const endState = todolistsReducer(startState, action);

    expect(endState[0].title).toBe("What to learn");
    expect(endState[1].title).toBe(newTodolistTitle);
});

test("correct filter of todolist should be changed", () => {
    let newFilter: FilterValuesType = "completed";

    const action = todolistsActions.changeTodolistFilter({
        id: todolistId2,
        filter: newFilter,
    });

    const endState = todolistsReducer(startState, action);

    expect(endState[0].filter).toBe("all");
    expect(endState[1].filter).toBe(newFilter);
});
test("todolists should be added", () => {
    const action = todolistsThunk.setTodolists.fulfilled({ todolists: startState }, "requiredid");

    const endState = todolistsReducer([], action);

    expect(endState.length).toBe(2);
});
test("correct entity status of todolist should be changed", () => {
    let newStatus: RequestStatusType = "loading";

    const action = todolistsActions.changeTodolistEntityStatus({
        id: todolistId2,
        status: newStatus,
    });

    const endState = todolistsReducer(startState, action);

    expect(endState[0].entityStatus).toBe("idle");
    expect(endState[1].entityStatus).toBe(newStatus);
});
