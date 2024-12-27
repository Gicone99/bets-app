import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

const Calendar = () => {
  const [cardsByDate, setCardsByDate] = useState({});
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [newCardTitle, setNewCardTitle] = useState("");
  const [taskInputs, setTaskInputs] = useState({});
  const [taskCotes, setTaskCotes] = useState({});
  const [editingCard, setEditingCard] = useState(null);
  const [editingTask, setEditingTask] = useState({
    cardId: null,
    taskIndex: null,
    newTaskName: "",
  });

  useEffect(() => {
    const storedCards = JSON.parse(localStorage.getItem("cardsByDate"));
    if (storedCards) {
      setCardsByDate(storedCards);
    }
  }, []);

  useEffect(() => {
    if (Object.keys(cardsByDate).length > 0) {
      localStorage.setItem("cardsByDate", JSON.stringify(cardsByDate));
    }
  }, [cardsByDate]);

  const generateDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    let days = [];
    const firstDayOfWeek = firstDayOfMonth.getDay();
    const adjustedFirstDayOfWeek = firstDayOfWeek === 0 ? 7 : firstDayOfWeek;

    for (let i = 0; i < adjustedFirstDayOfWeek - 1; i++) {
      days.push(null);
    }

    for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
      const formattedDate = `${year}-${month + 1}-${day}`;
      days.push(formattedDate);
    }

    return days;
  };

  const addCard = () => {
    if (!newCardTitle.trim() || !selectedDate) return;
    const newCard = {
      id: Date.now().toString(),
      title: newCardTitle,
      tasks: [],
      status: "pending", // Statusul inițial al cardului
    };

    setCardsByDate((prev) => ({
      ...prev,
      [selectedDate]: [...(prev[selectedDate] || []), newCard],
    }));

    setNewCardTitle("");
  };

  const deleteCard = (cardId) => {
    setCardsByDate((prev) => ({
      ...prev,
      [selectedDate]: prev[selectedDate].filter((card) => card.id !== cardId),
    }));
  };

  const updateCard = (cardId, updatedTitle) => {
    setCardsByDate((prev) => {
      const updatedCards = (prev[selectedDate] || []).map((card) =>
        card.id === cardId ? { ...card, title: updatedTitle } : card
      );
      return { ...prev, [selectedDate]: updatedCards };
    });
    setEditingCard(null);
  };

  const handleTaskInputChange = (cardId, value) => {
    setTaskInputs((prev) => ({ ...prev, [cardId]: value }));
  };

  const handleTaskCoteChange = (cardId, taskIndex, value) => {
    value = value.replace(",", ".");
    if (isNaN(value) || parseFloat(value) < 0) {
      return;
    }

    setTaskCotes((prev) => ({
      ...prev,
      [cardId]: {
        ...prev[cardId],
        [taskIndex]: parseFloat(value),
      },
    }));
  };

  const addTaskToCard = (cardId) => {
    const task = taskInputs[cardId]?.trim();
    if (!task) return;

    setCardsByDate((prev) => {
      const updatedCards = (prev[selectedDate] || []).map((card) =>
        card.id === cardId
          ? { ...card, tasks: [...card.tasks, { task, status: "pending" }] }
          : card
      );
      return { ...prev, [selectedDate]: updatedCards };
    });

    setTaskInputs((prev) => ({ ...prev, [cardId]: "" }));
  };

  const deleteTask = (cardId, taskIndex) => {
    setCardsByDate((prev) => {
      const updatedCards = (prev[selectedDate] || []).map((card) =>
        card.id === cardId
          ? {
              ...card,
              tasks: card.tasks.filter((_, index) => index !== taskIndex),
            }
          : card
      );
      return { ...prev, [selectedDate]: updatedCards };
    });

    setTaskCotes((prev) => {
      const updatedCotes = { ...prev };
      delete updatedCotes[cardId][taskIndex];
      return updatedCotes;
    });
  };

  const updateTaskStatus = (cardId, taskIndex, status) => {
    setCardsByDate((prev) => {
      const updatedCards = (prev[selectedDate] || []).map((card) =>
        card.id === cardId
          ? {
              ...card,
              tasks: card.tasks.map((task, index) =>
                index === taskIndex ? { ...task, status } : task
              ),
            }
          : card
      );
      return { ...prev, [selectedDate]: updatedCards };
    });
  };

  const updateTaskName = (cardId, taskIndex) => {
    setCardsByDate((prev) => {
      const updatedCards = (prev[selectedDate] || []).map((card) =>
        card.id === cardId
          ? {
              ...card,
              tasks: card.tasks.map((task, index) =>
                index === taskIndex
                  ? { ...task, task: editingTask.newTaskName }
                  : task
              ),
            }
          : card
      );
      return { ...prev, [selectedDate]: updatedCards };
    });
    setEditingTask({ cardId: null, taskIndex: null, newTaskName: "" });
  };

  const calculateTotalCote = (cardId) => {
    const tasksCotes = taskCotes[cardId] || {};
    return Object.values(tasksCotes).reduce((total, cote) => total * cote, 1);
  };

  const calculateCardStatus = (tasks) => {
    const hasLost = tasks.some((task) => task.status === "lost");
    const allWon = tasks.every((task) => task.status === "won");

    if (hasLost) return "lost";
    if (allWon) return "won";
    return "pending";
  };

  const goToPreviousMonth = () => {
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
    );
  };

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const hasCards = (date) => {
    return (cardsByDate[date] || []).length > 0;
  };

  return (
    <div className="max-w-4xl mx-auto bg-gradient-to-b from-blue-200 via-white to-blue-100 shadow-xl rounded-2xl p-8">
      <h1 className="text-3xl font-semibold text-center mb-6 text-gray-800">
        Calendar Task Manager with Cards
      </h1>
      <div className="flex justify-between items-center mb-6">
        <button
          className="text-2xl text-gray-600 hover:text-blue-500 transition duration-200"
          onClick={goToPreviousMonth}
        >
          ←
        </button>
        <span className="text-xl font-medium text-gray-700">
          {currentDate.toLocaleString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </span>
        <button
          className="text-2xl text-gray-600 hover:text-blue-500 transition duration-200"
          onClick={goToNextMonth}
        >
          →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-4">
        {weekDays.map((day) => (
          <div key={day} className="text-center font-medium text-gray-700">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2 mb-4">
        {generateDays().map((date, index) => (
          <div
            key={index}
            onClick={() => date && setSelectedDate(date)}
            className={`cursor-pointer p-2 rounded-lg text-center ${
              date ? "bg-white shadow-lg" : "bg-transparent"
            } ${date && selectedDate === date ? "ring-2 ring-cyan-600" : ""} ${
              date && hasCards(date) ? "bg-yellow-100" : ""
            }`}
          >
            {date ? date.split("-")[2] : ""}
            {date && cardsByDate[date]?.length > 0 && (
              <div className="mt-2 text-xs text-gray-600">
                {cardsByDate[date].length} Cards
              </div>
            )}
          </div>
        ))}
      </div>

      {selectedDate && (
        <div className="mt-6">
          <h2 className="text-xl font-medium text-gray-800 mb-4">
            Tasks for {selectedDate}
          </h2>
          <input
            type="text"
            value={newCardTitle}
            onChange={(e) => setNewCardTitle(e.target.value)}
            placeholder="New card title"
            className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
          />
          <button
            onClick={addCard}
            className="w-full py-2 bg-blue-600 text-white rounded-lg"
          >
            Add Card
          </button>

          <div className="mt-6">
            {cardsByDate[selectedDate]?.map((card) => (
              <div
                key={card.id}
                className="shadow-lg rounded-lg p-4 bg-white mb-4"
              >
                {editingCard === card.id ? (
                  <div className="flex flex-col">
                    <input
                      type="text"
                      defaultValue={card.title}
                      onBlur={(e) => updateCard(card.id, e.target.value.trim())}
                      className="border rounded p-2 mb-2"
                    />
                    <button
                      onClick={() => setEditingCard(null)}
                      className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <h3 className="text-xl font-semibold text-gray-700 mb-2 flex items-center justify-between">
                    {card.title}
                    <div className="flex gap-2">
                      <FaEdit
                        onClick={() => setEditingCard(card.id)}
                        className="text-blue-600 cursor-pointer hover:text-blue-800"
                      />
                      <FaTrash
                        onClick={() => deleteCard(card.id)}
                        className="text-red-600 cursor-pointer hover:text-red-800"
                      />
                    </div>
                  </h3>
                )}
                <div className="mt-4">
                  {card.tasks.map((task, index) => (
                    <div
                      key={index}
                      className="flex items-center mb-2 justify-between"
                    >
                      <select
                        value={task.status}
                        onChange={(e) =>
                          updateTaskStatus(card.id, index, e.target.value)
                        }
                        className="bg-gray-200 p-1 rounded-lg"
                      >
                        <option value="pending">Pending</option>
                        <option value="won">WON</option>
                        <option value="lost">LOST</option>
                      </select>
                      {editingTask.cardId === card.id &&
                      editingTask.taskIndex === index ? (
                        <input
                          type="text"
                          value={editingTask.newTaskName}
                          onChange={(e) =>
                            setEditingTask({
                              ...editingTask,
                              newTaskName: e.target.value,
                            })
                          }
                          onBlur={() => updateTaskName(card.id, index)}
                          className="ml-2 p-1 border rounded"
                        />
                      ) : (
                        <span
                          className={`${
                            task.status === "won"
                              ? "text-green-600 font-bold"
                              : task.status === "lost"
                              ? "text-red-600 font-bold"
                              : "text-gray-600"
                          }`}
                        >
                          {task.task}
                        </span>
                      )}

                      {/* Cota pentru Task */}
                      <input
                        type="number"
                        value={taskCotes[card.id]?.[index] || ""}
                        onChange={(e) =>
                          handleTaskCoteChange(card.id, index, e.target.value)
                        }
                        onBlur={(e) => {
                          handleTaskCoteChange(card.id, index, e.target.value);
                        }}
                        placeholder="Cota"
                        className="w-20 p-1 border border-gray-300 rounded-lg ml-4"
                      />

                      <div className="flex gap-2">
                        <FaEdit
                          onClick={() =>
                            setEditingTask({
                              cardId: card.id,
                              taskIndex: index,
                              newTaskName: task.task,
                            })
                          }
                          className="text-yellow-600 cursor-pointer hover:text-yellow-800 ml-2"
                        />
                        <FaTrash
                          onClick={() => deleteTask(card.id, index)}
                          className="text-red-600 cursor-pointer hover:text-red-800"
                        />
                      </div>
                    </div>
                  ))}
                  <input
                    type="text"
                    value={taskInputs[card.id] || ""}
                    onChange={(e) =>
                      handleTaskInputChange(card.id, e.target.value)
                    }
                    placeholder="Add task"
                    className="w-full p-2 border border-gray-300 rounded-lg mt-4"
                  />
                  <button
                    onClick={() => addTaskToCard(card.id)}
                    className="w-full py-2 bg-blue-600 text-white rounded-lg mt-2"
                  >
                    Add Task
                  </button>

                  {/* Cota Totală pe aceeași linie cu statusul cardului */}
                  {card.tasks.length > 0 && (
                    <div className="mt-4 flex items-center justify-between">
                      <span>
                        Status: {calculateCardStatus(card.tasks).toUpperCase()}
                      </span>
                      <span className="font-semibold text-gray-800">
                        Total Cota: {calculateTotalCote(card.id).toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
