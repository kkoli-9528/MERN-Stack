import { useEffect, useState } from "react";
import axios from "axios";
import TaskCard from "../features/tasks/TaskCard";
import TaskForm from "../features/tasks/TaskForm";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface Task {
  _id: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "done" | "pending";
  priority: "low" | "medium" | "high";
}

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // Sorting state
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  // Optional filter
  const [statusFilter, setStatusFilter] = useState("");

  const fetchTasks = async (pageNumber = 1) => {
  setLoading(true);
  try {
    const res = await axios.get("http://localhost:3000/api/task", {
      params: {
        page: pageNumber,
        limit: 5,
        sortBy,
        sortOrder,
        status: statusFilter === "all" ? undefined : statusFilter,
      },
      withCredentials: true,
    });

    setTasks(res.data.data);
    setPage(res.data.pagination.page);
    setPages(res.data.pagination.pages);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchTasks(page);
  }, [page, sortBy, sortOrder, statusFilter]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      <TaskForm onTaskCreated={() => fetchTasks(page)} />

      {/* Sorting & Filtering */}
      <div className="flex gap-4 items-center mt-4">
        {/* Sort By */}
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt">Created At</SelectItem>
            <SelectItem value="status">Status</SelectItem>
            <SelectItem value="priority">Priority</SelectItem>
          </SelectContent>
        </Select>

        {/* Sort Order */}
        <Select value={sortOrder} onValueChange={setSortOrder}>
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Order" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asc">Ascending</SelectItem>
            <SelectItem value="desc">Descending</SelectItem>
          </SelectContent>
        </Select>

        {/* Status Filter */}
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="todo">Todo</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="done">Done</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Task List */}
      {loading ? (
        <p className="mt-4">Loading...</p>
      ) : (
        <div className="mt-4 grid gap-4">
          {tasks.map((task) => (
            <TaskCard key={task._id} task={task} refreshTasks={() => fetchTasks(page)} />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex justify-center gap-4 mt-6">
        <Button
          variant="outline"
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          Prev
        </Button>
        <span className="flex items-center">
          Page {page} of {pages}
        </span>
        <Button
          variant="outline"
          onClick={() => setPage((prev) => Math.min(prev + 1, pages))}
          disabled={page === pages}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
