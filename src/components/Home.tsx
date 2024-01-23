// import { Button } from "./ui/button"; 
// import { Link } from 'react-router-dom';
// import Header from "./header";
// import { Firebase } from "../providers/user"; 
// import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd'




// export const Home = () => {
//   const { user } = Firebase.useContainer();

//   // Sample list of items
//   const finalSpaceCharacters = [
//     {
//       id: 'Griffin',
//       name: 'Greeve',
     
//     },
//     {
//       id: 'Matt',
//       name: 'Ice',
     
//     },

//     {
//       id: 'Justin',
//       name: 'Brav',
      
//     },
//   ]

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen">
//       <Header />
//       {user && ( 
//         <div className="top-right-button">
//           <Link to="/add-new-deal">
//             <Button style={{
//               backgroundColor: '#3391CC',
//               color: 'white',
//               border: 'none',
//               padding: '10px 15px',
//               borderRadius: '5px',
//               fontSize: '16px',
//               fontWeight: 'bold',
//               cursor: 'pointer',
//               boxShadow: 'none',
//               textDecoration: 'none',
//             }}>+ Add New</Button>
//           </Link>
//         </div>
//       )}
      
//     <DragDropContext onDragEnd={onDragEnd}>
//       <Droppable droppableId="kanban">
//         {(provided) => (
//           <div {...provided.droppableProps} ref={provided.innerRef}>
//             {finalSpaceCharacters .map((id, name) => (
//               <Draggable key={finalSpaceCharacters.id} draggableId={finalSpaceCharacters.id} id={id}>
//                 {(provided) => (
//                   <div
//                     {...provided.draggableProps}
//                     {...provided.dragHandleProps}
//                     ref={provided.innerRef}
//                   >
//                     {task.content}
//                   </div>
//                 )}
//               </Draggable>
//             ))}
//             {provided.placeholder}
//           </div>
//         )}
//       </Droppable>
//     </DragDropContext>
//   );
// };

import React, { useState } from 'react';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import Header from './header';

interface Task {
  id: string;
  content: string;
}

interface HomeProps {
  user: any; // Replace 'any' with the correct type for your user
}

const Home: React.FC<HomeProps> = ({ user }) => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 'task-1', content: 'Task 1' },
    { id: 'task-2', content: 'Task 2' },
    { id: 'task-3', content: 'Task 3' },
  ]);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const updatedTasks = Array.from(tasks);
    const [movedTask] = updatedTasks.splice(result.source.index, 1);
    updatedTasks.splice(result.destination.index, 0, movedTask);

    setTasks(updatedTasks);
  };


      tasks.map((task) => {
        console.log(task.id);
       
      });
    
  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Header />
      {user && (
        <div className="top-right-button">
          <Link to="/add-new-deal">
            <Button style={{
              backgroundColor: '#3391CC',
              color: 'white',
              border: 'none',
              padding: '10px 15px',
              borderRadius: '5px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: 'none',
              textDecoration: 'none',
            }}>+ Add New</Button>
          </Link>
        </div>
      )}

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="tasksList">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="droppable-container">
              {tasks.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id} index={index}>
                  {(provided) => (
                    <button
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                    style={{
                      padding: '10px',
                      margin: '5px',
                      backgroundColor: '#f0f0f0',
                      border: '1px solid #ddd',
                      borderRadius: '5px',
                      cursor: 'pointer'
                    }}
                  >
                    {task.content}
                  </button>
                      
                    
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default Home;
