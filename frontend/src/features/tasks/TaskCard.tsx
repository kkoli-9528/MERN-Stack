import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EditTaskDialog } from "./EditTaskDialog";

interface TaskProps {
  task: any;
  refreshTasks: () => void;
}

export default function TaskCard({ task, refreshTasks }: TaskProps) {
  const handleDelete = async () => {
    await fetch(`http://localhost:3000/api/task/${task._id}`, {
      method: "DELETE",
      credentials: "include",
    });
    refreshTasks();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{task.title}</CardTitle>
        <CardDescription>{task.description}</CardDescription>
      </CardHeader>
      <CardFooter className="flex justify-between items-center">
        <div className="flex gap-2">
          <Badge variant="secondary">{task.status}</Badge>
          <Badge>{task.priority}</Badge>
        </div>
        <div className="flex gap-2">
          <EditTaskDialog task={task} refreshTasks={refreshTasks} />
          <Button variant="destructive" size="sm" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
