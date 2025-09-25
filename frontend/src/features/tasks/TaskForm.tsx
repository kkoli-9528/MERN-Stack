import { useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function TaskForm({
  onTaskCreated,
}: {
  onTaskCreated: () => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("pending");
  const [priority, setPriority] = useState("medium");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await axios.post(
      "http://localhost:3000/api/task",
      { title, description, status, priority },
      { withCredentials: true }
    );
    setTitle("");
    setDescription("");
    onTaskCreated();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 p-4 border rounded-lg shadow-sm bg-card">
      {/* Title */}
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task title"
      />

      {/* Description */}
      <Input
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Task description"
      />

      {/* Status */}
      <Select value={status} onValueChange={setStatus}>
        <SelectTrigger>
          <SelectValue placeholder="Select status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todo">Todo</SelectItem>
          <SelectItem value="in-progress">In Progress</SelectItem>
          <SelectItem value="done">Done</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
        </SelectContent>
      </Select>

      {/* Priority */}
      <Select value={priority} onValueChange={setPriority}>
        <SelectTrigger>
          <SelectValue placeholder="Select priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="low">Low</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="high">High</SelectItem>
        </SelectContent>
      </Select>

      {/* Submit */}
      <Button type="submit" className="w-full">
        Add Task
      </Button>
    </form>
  );
}
