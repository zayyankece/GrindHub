import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Search, Filter, Menu } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const tasks = [
  { code: "CS1010S", title: "Mission 1", progress: 90 },
  { code: "HSA1000", title: "Field Observation Exercise", progress: 70 },
  { code: "IS1108", title: "Assignment 2", progress: 10 },
  { code: "IT1244", title: "Group Project 1", progress: 20 },
  { code: "MA2104", title: "Homework 1", progress: 30 },
  { code: "HSI1000", title: "Workshop 2", progress: 50 },
  { code: "SP1541", title: "Writing Assignment 2", progress: 30 },
  { code: "ES1103", title: "Synthesis CA1", progress: 50 },
  { code: "MA2002", title: "Homework 1", progress: 20 },
];

export default function TaskList() {
  return (
    <div className="w-[320px] mx-auto bg-orange-50 h-screen flex flex-col">
      <div className="bg-orange-500 text-white flex items-center px-4 py-2 justify-between">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <img src="/logo.png" alt="GrindHub Logo" className="w-6 h-6" />
          GrindHub
        </h1>
        <button>
          <Menu className="w-6 h-6" />
        </button>
      </div>

      <div className="p-4 flex items-center gap-2">
        <Input placeholder="Search" className="rounded-full" />
        <Button variant="ghost" size="icon">
          <Search className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <Filter className="w-4 h-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1 px-4 pb-4">
        {tasks.map((task, idx) => (
          <Card key={idx} className="mb-2 bg-yellow-200">
            <CardContent className="p-3">
              <div className="font-semibold text-sm">{task.code} - {task.title}</div>
              <div className="text-xs text-gray-600 mb-1">{task.progress}% Completed</div>
              <Progress value={task.progress} className="h-2 mb-1" />
              <div className="text-xs text-right text-gray-700">Due 25 May - 23.00</div>
            </CardContent>
          </Card>
        ))}
      </ScrollArea>

      <div className="bg-white border-t border-gray-200 p-2 flex justify-around">
        <Button variant="ghost" className="flex flex-col items-center text-xs">
          <img src="/home.svg" className="w-5 h-5" />
          Home
        </Button>
        <Button variant="ghost" className="flex flex-col items-center text-xs">
          <img src="/calendar.svg" className="w-5 h-5" />
          Calendar
        </Button>
        <Button variant="ghost" className="flex flex-col items-center text-xs">
          <img src="/tasks.svg" className="w-5 h-5" />
          Tasks
        </Button>
        <Button variant="ghost" className="flex flex-col items-center text-xs">
          <img src="/user.svg" className="w-5 h-5" />
          Profile
        </Button>
      </div>
    </div>
  );
}
