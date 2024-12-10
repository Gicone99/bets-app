import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"; // Importăm bibliotecile necesare pentru drag-and-drop

const Calendar = () => {
  const [cardsByDate, setCardsByDate] = useState({});
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [newCardTitle, setNewCardTitle] = useState("");
  const [taskInputs, setTaskInputs] = useState({});
  const [editingCard, setEditingCard] = useState(null); // For updating cards
  const [editingTask, setEditingTask] = useState({}); // For updating tasks

  // 1. Încărcăm datele din localStorage atunci când componenta se încarcă
  useEffect(() => {
    const storedCards = JSON.parse(localStorage.getItem("cardsByDate"));
    if (storedCards) {
      setCardsByDate(storedCards);
    }
  }, []);

  // 2. Salvăm datele în localStorage atunci când cardsByDate se schimbă
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

  const addTaskToCard = (cardId) => {
    const task = taskInputs[cardId]?.trim();
    if (!task) return;

    setCardsByDate((prev) => {
      const updatedCards = (prev[selectedDate] || []).map((card) =>
        card.id === cardId ? { ...card, tasks: [...card.tasks, task] } : card
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
  };

  const updateTask = (cardId, taskIndex, updatedTask) => {
    setCardsByDate((prev) => {
      const updatedCards = (prev[selectedDate] || []).map((card) =>
        card.id === cardId
          ? {
              ...card,
              tasks: card.tasks.map((task, index) =>
                index === taskIndex ? updatedTask : task
              ),
            }
          : card
      );
      return { ...prev, [selectedDate]: updatedCards };
    });
    setEditingTask({});
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

  // Funcția care se ocupă de reorganizarea cardurilor
  const onDragEnd = (result) => {
    const { destination, source } = result;

    // Dacă nu există o destinație, ieșim
    if (!destination) return;

    // Dacă cardul rămâne pe aceeași poziție, nu facem nimic
    if (
      destination.index === source.index &&
      destination.droppableId === source.droppableId
    )
      return;

    const sourceDate = source.droppableId;
    const destinationDate = destination.droppableId;

    // Mutăm cardul între zile (dacă sunt diferite)
    if (sourceDate !== destinationDate) {
      const sourceCards = Array.from(cardsByDate[sourceDate]);
      const [removed] = sourceCards.splice(source.index, 1);
      const destinationCards = Array.from(cardsByDate[destinationDate] || []);
      destinationCards.splice(destination.index, 0, removed);

      setCardsByDate((prev) => ({
        ...prev,
        [sourceDate]: sourceCards,
        [destinationDate]: destinationCards,
      }));
    } else {
      // Reorganizăm cardurile în aceeași zi
      const updatedCards = Array.from(cardsByDate[sourceDate]);
      const [removed] = updatedCards.splice(source.index, 1);
      updatedCards.splice(destination.index, 0, removed); // Mutăm cardul la noua poziție

      setCardsByDate((prev) => ({
        ...prev,
        [sourceDate]: updatedCards,
      }));
    }
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
            onClick={() => date && setSelectedDate(date)} // Numai zile valide pot fi selectate
            className={`cursor-pointer p-2 rounded-lg text-center ${
              date ? "bg-white shadow-lg" : "bg-transparent"
            } ${
              date && selectedDate === date
                ? "ring-2 ring-cyan-600" // Chenar albastru pentru ziua selectată
                : ""
            } ${
              date && hasCards(date) ? "bg-yellow-100" : "" // Fundal galben pentru zilele cu carduri
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

          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId={selectedDate} type="card">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6"
                >
                  {cardsByDate[selectedDate]?.map((card, index) => (
                    <Draggable
                      key={card.id}
                      draggableId={card.id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          className="shadow-lg rounded-lg p-4 bg-white relative"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          {editingCard === card.id ? (
                            <div className="flex flex-col">
                              <input
                                type="text"
                                defaultValue={card.title}
                                onBlur={(e) =>
                                  updateCard(card.id, e.target.value.trim())
                                }
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
                                {editingTask[card.id] === index ? (
                                  <input
                                    type="text"
                                    defaultValue={task}
                                    onBlur={(e) =>
                                      updateTask(
                                        card.id,
                                        index,
                                        e.target.value.trim()
                                      )
                                    }
                                    className="border rounded p-2 w-full mr-2"
                                  />
                                ) : (
                                  <span>{task}</span>
                                )}
                                <div className="flex gap-2">
                                  <FaEdit
                                    onClick={() =>
                                      setEditingTask({ [card.id]: index })
                                    }
                                    className="text-blue-600 cursor-pointer hover:text-blue-800"
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
                              placeholder="New Task"
                              className="w-full p-2 border border-gray-300 rounded-lg"
                            />
                            <button
                              onClick={() => addTaskToCard(card.id)}
                              className="w-full py-2 mt-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                            >
                              Add Task
                            </button>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      )}
    </div>
  );
};

export default Calendar;
