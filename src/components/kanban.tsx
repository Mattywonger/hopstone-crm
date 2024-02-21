import PlusIcon from "../icons/PlusIcon";
import { useMemo, useState } from "react";
import { Column, Id, Task } from "../types";
import ColumnContainer from "./ColumnContainer";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import DealCard from "./DealCard";
import { Status, dealsCollectionPath, findDeal, setStatus, useDeals } from "../lib/deals";
import { $enum } from "ts-enum-util";
import { Context } from "@dnd-kit/sortable/dist/components";
import { enumKeys } from "../lib/utils";
import { Firestore } from "firebase/firestore";
import { Firebase } from "../providers/user";
import { ErrorDisplay } from "./Error";
import { LoadingPage } from "./LoadingPage";

const defaultCols: Column[] = enumKeys(Status).map(status => (
  {
    id: status,
    title: (Status as any)[status],
  }
))

const defaultTasks: Task[] = []
function KanbanBoard() {
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const { firestore } = Firebase.useContainer()
  const [deals, loading, error] = useDeals(firestore, dealsCollectionPath)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  return (
    <>
      {error && <ErrorDisplay error={error} />}
      {loading ? <LoadingPage /> : <div
        className="
        m-auto
        flex
        min-h-screen
        w-full
        items-center
        overflow-x-auto
        overflow-y-hidden
        px-[40px]
    "
      >
        <DndContext
          sensors={sensors}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onDragOver={onDragOver}
        >
          <div className="m-auto flex gap-4">
            <div className="flex gap-4">
              <div style={{ display: "flex" }}>
                {defaultCols.map((col) => (
                  <ColumnContainer
                    key={col.id}
                    column={col}
                    createTask={createTask}
                    deleteTask={deleteTask}
                    updateTask={updateTask}
                    deals={deals.deals.filter(deal => deal.data.status == col.id)}
                    updateColumn={() => { }} // TODO check
                  />
                ))}
              </div>
            </div>
          </div>

        </DndContext>
      </div>}
    </>
  );

  function createTask(columnId: Id) {
  }

  function deleteTask(id: Id) {
  }

  function updateTask(id: Id, content: string) {
  }


  function onDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
      return;
    }
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveTask(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";

    if (!isActiveATask) return;

    // Im dropping a Task over another Task
    /*if (isActiveATask && isOverATask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);

        if (tasks[activeIndex].columnId != tasks[overIndex].columnId) {
          // Fix introduced after video recording
          tasks[activeIndex].columnId = tasks[overIndex].columnId;
          return arrayMove(tasks, activeIndex, overIndex - 1);
        }

        return arrayMove(tasks, activeIndex, overIndex);
      });
    }*/

    const isOverAColumn = over.data.current?.type === "Column";

    // Im dropping a Task over a column
    if (isActiveATask && isOverAColumn) {
      const deal = findDeal(deals, activeId.toString())
      if (deal) {
        setStatus(deal, overId as Status)
      }
    }
  }
}

export default KanbanBoard;
