import Search from './components/Search.jsx'
import Btn_Add from './components/Btn-Add.jsx'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { MdDelete } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { useState, useEffect } from 'react';


function App() {

  //UseState
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [editedTask, setEditedTask] = useState('');
  const [editIndex, setEditIndex] = useState(null);

  //HandleSaveTask

  const handleSaveTask = (taskName, reminderTime) => {
    const newTask = { name: taskName, reminderTime, completed: false };
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
  
    // Guardamos solo los datos necesarios en el localStorage
    const tasksToSave = updatedTasks.map(({ name, reminderTime, completed }) => ({ name, reminderTime, completed }));
  
    // Usamos JSON.stringify con una función de replacer para filtrar los elementos no serializables
    localStorage.setItem("tasks", JSON.stringify(tasksToSave, (key, value) => {
      if (value instanceof Node || value instanceof Window) {
        return undefined; // Excluir elementos no serializables
      }
      return value;
    }));
  
    // Mostramos la notificación de nueva tarea
    showNotification("Nueva tarea", `Se ha agregado una nueva tarea: ${taskName}`);
  
    // Programamos una notificación para el recordatorio
    if (reminderTime) {
      const now = new Date();
      const [hours, minutes] = reminderTime.split(":");
      const reminderDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0);
  
      if (reminderDate > now) {
        const timeoutId = setTimeout(() => {
          showNotification("Recordatorio", `Recordatorio para la tarea: ${taskName}`);
        }, reminderDate.getTime() - now.getTime());
  
        return () => clearTimeout(timeoutId);
      }
    }
  };

  const handleEditTask = (index) => {
    setEditIndex(index);
    setEditedTask(tasks[index].name);
  };

  const handleUpdateTask = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].name = editedTask;
    setTasks(updatedTasks);
    setEditIndex(null);
    setEditedTask('');
  };

  const handleToggleComplete = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].completed = !updatedTasks[index].completed;
    setTasks(updatedTasks);
  };

  const handleDeleteTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  // useEffect(() => {
  //   const tasksFromLocalStorage = localStorage.getItem("tasks");
  //   if (tasksFromLocalStorage) {
  //     setTasks(JSON.parse(tasksFromLocalStorage));
  //   }
  // }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  
  const showNotification = (title, message) => {
    if ("Notification" in window) {
      Notification.requestPermission().then((result) => {
        if (result === "granted") {
          new Notification(title, { body: message });
        }
      });
    }
  };

  useEffect(() => {
  const intervalId = setInterval(() => {
    showNotification();
  }, 60000); // Comprobar cada minuto
  return () => clearInterval(intervalId);
}, []);

  return (
    <>
      <section className="w-[650px] h-[700px] bg-[#F7F7FF] rounded-3xl shadow-2xl">
        <div className='bg-gradient-to-br from-yellow-400 to-yellow-700 w-full h-1/5 rounded-t-3xl flex justify-center '>
          <h1 className='text-center text-white text-3xl pt-6'>TODO List</h1>
        </div>
        <div className=' w-full h-full px-12 '>
          <div className='bg-white h-36 rounded-lg relative bottom-16 gap-y-5'>
            <div id="search" className='flex flex-col justify-around place-content-around items-center h-36 shadow-lg rounded-lg  mb-12' >
              <Search />
              <Btn_Add onSave={handleSaveTask}/>
            </div>
            <div id="task-list" className='bg-white h-96 shadow-lg rounded-lg'>
              <div className='p-4 w-full h-full flex flex-col gap-y-5'>
                <p className='text-black font-medium text-lg'>Todo List</p>
                <div id='cont-task' >
                <ul id='task-list' className='w-full'>
                    {tasks.map((task, index) => (
                      <li key={index} className="flex items-center justify-between mb-2 w-full text-black">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => handleToggleComplete(index)}
                            className="mr-4 checkbox checkbox-success"
                          />
                          {editIndex === index ? (
                            <input
                              type="text"
                              value={editedTask}
                              onChange={(e) => setEditedTask(e.target.value)}
                              className="border border-gray-300 rounded px-2 py-1 mr-2 bg-transparent"
                            />
                          ) : (
                            <span className={task.completed ? "line-through bg-transparent" : ""}  >{task.name}</span>
                          )}
                        </div>
                        <div>
                          {editIndex === index ? (
                            <button onClick={() => handleUpdateTask(index)} className="bg-[#a87200] hover:bg-[#8a5909] text-white px-2 py-1 mr-2 rounded-md">Guardar</button>
                          ) : (
                            <button onClick={() => handleEditTask(index)} className="px-2 py-1 mr-2"><FaRegEdit /></button>
                          )}
                          <button onClick={() => handleDeleteTask(index)} className="px-2 py-1">
                          <MdDelete />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
        </div>  
        </div>
      </section>
    </>
  )
}

export default App
