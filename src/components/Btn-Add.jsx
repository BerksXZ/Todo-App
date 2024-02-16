import { useState, useEffect } from "react";

function Btn_Add({ onSave }) {
    const [isOpen, setIsOpen] = useState(false);
    const [taskName, setTaskName] = useState('');
    const [tasks, setTasks] = useState([]);
    const [reminderTime, setReminderTime] = useState('');

    const openModal = () => {
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const newTask = { id: tasks.length + 1, name: taskName };
        const updatedTasks = [...tasks, newTask];
        setTasks(updatedTasks);
        onSave(taskName, reminderTime);
        setTaskName('');
        setReminderTime('');
        localStorage.setItem("tasks", JSON.stringify(updatedTasks));
        console.log(localStorage.getItem("task"))
        closeModal();
    };

    //UseEffect
    const loadTasksFromLocalStorage = () => {
        const tasksFromLocalStorage = localStorage.getItem("tasks");
        if (tasksFromLocalStorage) {
            setTasks(JSON.parse(tasksFromLocalStorage));
        }
    };

    useEffect(() => {
        loadTasksFromLocalStorage();
    }, []);


    return (
        <div className="flex justify-center items-center h-screen">
            <button onClick={openModal} className="bg-[#a87200] hover:bg-[#8a5909] text-white py-2 px-4 rounded">
                Add Task
            </button>
            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="absolute inset-0 bg-gray-900 opacity-50"></div>
                    <div className="bg-white p-8 rounded-lg z-50 w-[400px] h-[240px] flex flex-col justify-around">
                        <h2 className="text-lg font-bold mb-4 text-black">Añadir Nueva Tarea</h2>
                        <form onSubmit={handleSubmit} className="flex flex-col h-full">

                            <input
                                type="text"
                                id="taskName"
                                name="taskName"
                                required
                                value={taskName}
                                placeholder="Nombre de Tarea"
                                onChange={(event) => setTaskName(event.target.value)}
                                className="border-b border-black px-2 py-2 mb-4 bg-transparent  hover:outline-none text-black focus:outline-none"
                            />
                            <label className="block mb-2">        
                                reminder time:
                                <input
                                    type="time"
                                    value={reminderTime}
                                    onChange={(event) => setReminderTime(event.target.value)}
                                    className="block w-full border-gray-300 rounded-md mt-1"
                                />
                            </label>
                            <div className="flex justify-between items-end">
                                <button type="submit" className="btn bg-[#a87200] hover:bg-[#8a5909] text-white font-bold rounded w-24 outline-none border-none">
                                    Add
                                </button>
                                <button type="submit" onClick={closeModal} className="btn btn-error text-white font-bold rounded w-24">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );

};


export default Btn_Add;