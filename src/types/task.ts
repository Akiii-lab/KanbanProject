export interface Task {
    id: number;
    create_date: string;
    update_date: string;
    content: string;
    title: string;
    user_id: number;
    board_id: number;
    state_id: number;
}

export interface TaskState {
    id: number;
    name: string;
}

export interface UserTask {
    id: number;
    username: string;
    email: string;
}

export interface SaveTask {
    title: string;
    content: string;
    user_id: number;
}