import { useState } from "react";
import TrashIcon from "../icons/TrashIcon";
import { Id, Task } from "../types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Deal, deleteDeal } from "../lib/deals";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { DocumentData, DocumentReference, arrayRemove } from "firebase/firestore";
import { updateDoc } from "firebase/firestore";
import * as Dialog from "@radix-ui/react-dialog"
import { Cross2Icon } from "@radix-ui/react-icons";
import "../dealCard.css"

interface Props {
  deal: Deal;
  deleteTask: (id: Id) => void;
  updateTask: (id: Id, content: string) => void;
}

function DealCard({ deal, deleteTask, updateTask }: Props) {
  const [mouseIsOver, setMouseIsOver] = useState(false);
  const [showModel, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: deal.ref.id,
    data: {
      type: "Task",
      deal,
    },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const toggleEditMode = () => {
    setEditMode((prev) => !prev);
    setMouseIsOver(false);
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="
          opacity-30
          bg-mainBackgroundColor p-2.5 h-[100px] min-h-[100px] items-center flex text-left rounded-xl border-2 border-rose-500  cursor-grab relative
        "
      />
    );
  }

  //NOTE: Edit Mode removed here

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={toggleEditMode}
      className="bg-mainBackgroundColor p-2.5 h-[200px] min-h-[100px] items-center flex text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-rose-500 cursor-grab relative border-4 border-indigo-500"
      onMouseEnter={() => {
        setMouseIsOver(true);
      }}
      onMouseLeave={() => {
        setMouseIsOver(false);
      }}
    >

      <div className="my-auto h-full w-full overflow-y-auto overflow-x-hidden whitespace-pre-wrap">
        <h1>{deal.data.name}</h1>
        <h2>{deal.data.pointPersonName}</h2>
        <Dialog.Root>
          <Dialog.Trigger asChild>
            <Button>View</Button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="DialogOverlay" />
            <Dialog.Content className="DialogContent">
              <Dialog.Title className="DialogTitle">{deal.data.name}</Dialog.Title>
              <div>

              </div>
              <Dialog.Close asChild>
                <button className="IconButton" aria-label="Close">
                  <Cross2Icon />
                </button>
              </Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
        <Button onClick={e => {
          updateDoc(deal.data.pod,
            { deals: arrayRemove(deal.ref) });
          deleteDeal(deal)
        }}>Delete</Button>
      </div>
    </div>
  );
}

export default DealCard;
