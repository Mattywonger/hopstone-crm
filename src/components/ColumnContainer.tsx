import { SortableContext, useSortable } from "@dnd-kit/sortable";
import TrashIcon from "../icons/TrashIcon";
import { Column, Id, Task } from "../types";
import { CSS } from "@dnd-kit/utilities";
import { useMemo, useState } from "react";
import DealCard from "./DealCard";
import { Deal } from "../lib/deals";

interface Props {
  column: Column;
  updateColumn: (id: Id, title: string) => void;
  createTask: (columnId: Id) => void;
  updateTask: (id: Id, content: string) => void;
  deleteTask: (id: Id) => void;
  deals: Deal[];
}

function ColumnContainer({
  column,
  updateColumn,
  createTask,
  deals,
  deleteTask,
  updateTask,
}: Props) {

  const tasksIds = useMemo(() => {
    return deals.map((deal) => deal.ref.id);
  }, [deals]);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="
          bg-columnBackgroundColor
          opacity-40
          border-2
          border-pink-500
          w-[180px]
          rounded-md
          flex
          flex-col
        "
      ></div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="
        bg-columnBackgroundColor
        w-[180px]
        rounded-md
        flex
        flex-col
        mb-4
      "
    >
      {/* Column title */}
      <div
        {...attributes}
        {...listeners}
        className="
          bg-mainBackgroundColor
          text-md
          h-[50px]
          cursor-grab
          rounded-t-md
          p-2
          font-bold
          border-b
          border-columnBackgroundColor
          flex
          items-center
          justify-between
        "
      >
        <div className="flex gap-2">
          <div
            className="
              flex
              justify-center
              items-center
              bg-columnBackgroundColor
              px-2
              py-1
              text-sm
              rounded-full
            "
          >
          </div>
          {column.title}
        </div>
        <button
          onClick={() => {
            //deleteColumn(column.id);
          }}
          className="
            text-gray-500
            hover:text-white
            hover:bg-columnBackgroundColor
            rounded
            p-1
          "
        >
          <TrashIcon />
        </button>
      </div>

      {/* Column task container */}
      <div className="flex-grow flex-col p-2">
        <SortableContext items={tasksIds}>
          {deals.map((deal) => (
            <DealCard
              key={deal.ref.id}
              deal={deal}
              deleteTask={deleteTask}
              updateTask={updateTask}
            />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}

export default ColumnContainer;
