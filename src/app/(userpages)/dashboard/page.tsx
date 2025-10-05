"use client";
import { Loader } from "@/components/Loader/loader";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { GrapshTask } from "@/types/task";
import { useEffect, useState } from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import { toast } from "sonner";

const statusMap: { [key: number]: string } = {
    1: 'Pending',
    2: 'In Progress',
    3: 'Under Review',
    4: 'Finished'
};

const statusColors: { [key: string]: string } = {
    'Pending': '#f59e0b',      
    'In Progress': '#773ac1',
    'Under Review': '#3b82f6',
    'Finished': '#10b981'
};

export default function DashboardPage() {
    const [loading, setLoading] = useState(true);
    const [totalBoards, setTotalBoards] = useState(0);
    const [totalActiveTasks, setActiveTotalTasks] = useState(0);
    const [totalFinishedTasks, setTotalFinishedTasks] = useState(0);
    const [activityData, setActivityData] = useState<{ date: string, count: number }[]>([]);
    const [taskStatusData, setTaskStatusData] = useState<{ status: string, count: number }[]>([]);
    const [recentlyTask, setRecentlyTask] = useState<GrapshTask>();
    const [recentlyUpdatedTask, setRecentlyUpdatedTask] = useState<GrapshTask>();
    const [oldTask, setOldTask] = useState<GrapshTask>();

    const fetchData = async () => {
        try {
            const response = await fetch('/api/user/graphs');
            const data = await response.json();
            console.log("Dashboard fetch response:", data);
            if (!data.ok) {
                throw new Error(data.error || 'Failed to fetch data');
            }

            setTotalBoards(data.data.boards);
            setActiveTotalTasks(data.data.activeTasks);
            setTotalFinishedTasks(data.data.completedTasks);
            const activityArray = Object.entries(data.data.activityData).map(([date, count]) => ({ date, count: count as number }));
            setActivityData(activityArray);
            const statusArray = Object.entries(data.data.taskStatusData).map(([status, count]) => ({ status: statusMap[parseInt(status)], count: count as number }));
            setTaskStatusData(statusArray);
            setRecentlyTask(data.data.mostRecentlyCreated);
            setRecentlyUpdatedTask(data.data.mostRecentlyUpdated);
            setOldTask(data.data.oldestTask);
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
            toast.error("Failed to fetch dashboard data");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        console.log(taskStatusData);
    }, [taskStatusData]);

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader />
            </div>
        )
    }

    return (
        <>
            <div className="flex flex-col h-full w-full p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                    <Card className="shadow-sm bg-black">
                        <CardHeader className="pb-2 text-muted-foreground font-bold">
                            Total Boards
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center flex-row justify-between w-full">
                                <div className="text-2xl font-bold">{totalBoards}</div>
                                <span
                                    className="inline-block w-4 h-4 rounded-full mr-2 opacity-40"
                                    style={{ backgroundColor: 'var(--c-violet)' }}
                                ></span>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="shadow-sm bg-black">
                        <CardHeader className="pb-2 text-muted-foreground font-bold">
                            Active Tasks
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center flex-row justify-between w-full">
                                <div className="text-2xl font-bold">{totalActiveTasks}</div>
                                <span
                                    className="inline-block w-4 h-4 rounded-full mr-2 opacity-40 bg-yellow-500"
                                ></span>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="shadow-sm bg-black">
                        <CardHeader className="pb-2 text-muted-foreground font-bold">
                            Completed Tasks
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center flex-row justify-between w-full">
                                <div className="text-2xl font-bold">{totalFinishedTasks}</div>
                                <span
                                    className="inline-block w-4 h-4 rounded-full mr-2 opacity-40 bg-green-500"
                                ></span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-max">
                    <Card className="shadow-sm bg-black">
                        <CardHeader>
                            <h3 className="text-lg font-semibold">Activity Timeline</h3>
                            <p className="text-sm text-muted-foreground">Daily task activity over time</p>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={activityData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis
                                        dataKey="date"
                                        tick={{ fontSize: 12 }}
                                        angle={-45}
                                        textAnchor="end"
                                        height={60}
                                    />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line
                                        type="monotone"
                                        dataKey="count"
                                        stroke="#8884d8"
                                        strokeWidth={2}
                                        name="Tasks Updated"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                    <Card className="shadow-sm bg-black">
                        <CardHeader>
                            <h3 className="text-lg font-semibold">Tasks by Status</h3>
                            <p className="text-sm text-muted-foreground">Distribution of tasks across different states</p>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={taskStatusData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="status" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar
                                        dataKey="count"
                                        name="Number of Tasks"
                                    >
                                        {taskStatusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={statusColors[entry.status]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>
                <div className="w-full">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                        <Card className="shadow-sm bg-black">
                            <CardHeader className="pb-2">
                                <h3 className="text-lg font-semibold text-[color:var(--c-violet)]">Most Recently Created</h3>
                                <p className="text-sm text-muted-foreground">Latest task created</p>
                            </CardHeader>
                            <CardContent>
                                {recentlyTask ? (
                                    <div className="space-y-2">
                                        <div className="font-semibold text-white">{recentlyTask.title}</div>
                                        <div className="text-sm text-gray-300">{recentlyTask.content}</div>
                                        <div className="text-xs text-muted-foreground">
                                            Board: {recentlyTask.board}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            Status: {statusMap[recentlyTask.state]}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            Created: {new Date(recentlyTask.date).toLocaleDateString()}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-muted-foreground">No recent tasks</div>
                                )}
                            </CardContent>
                        </Card>
                        <Card className="shadow-sm bg-black">
                            <CardHeader className="pb-2">
                                <h3 className="text-lg font-semibold text-green-400">Most Recently Updated</h3>
                                <p className="text-sm text-muted-foreground">Latest task updated</p>
                            </CardHeader>
                            <CardContent>
                                {recentlyUpdatedTask ? (
                                    <div className="space-y-2">
                                        <div className="font-semibold text-white">{recentlyUpdatedTask.title}</div>
                                        <div className="text-sm text-gray-300">{recentlyUpdatedTask.content}</div>
                                        <div className="text-xs text-muted-foreground">
                                            Board: {recentlyUpdatedTask.board}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            Status: {statusMap[recentlyUpdatedTask.state]}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            Updated: {new Date(recentlyUpdatedTask.date).toLocaleDateString()}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-muted-foreground">No updated tasks</div>
                                )}
                            </CardContent>
                        </Card>
                        <Card className="shadow-sm bg-black">
                            <CardHeader className="pb-2">
                                <h3 className="text-lg font-semibold text-orange-400">Oldest Task</h3>
                                <p className="text-sm text-muted-foreground">First task created</p>
                            </CardHeader>
                            <CardContent>
                                {oldTask ? (
                                    <div className="space-y-2">
                                        <div className="font-semibold text-white">{oldTask.title}</div>
                                        <div className="text-sm text-gray-300">{oldTask.content}</div>
                                        <div className="text-xs text-muted-foreground">
                                            Board: {oldTask.board}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            Status: {statusMap[oldTask.state]}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            Created: {new Date(oldTask.date).toLocaleDateString()}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-muted-foreground">No old tasks</div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}