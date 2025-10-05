export interface Task {
    id: number;
    created_at: string;
    updated_at: string;
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
export interface GrapshTask {
    title: string;
    content: string;
    date: string;
    board: string;
    state: number;
}