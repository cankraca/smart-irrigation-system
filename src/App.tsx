import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, {
  Draggable,
  DropArg,
} from "@fullcalendar/interaction";
import allLocales from "@fullcalendar/core/locales-all";
import React, { useEffect, useState } from "react";

interface MyEvent {
  id: string;
  title: string;
  date: string;
  color: string;
}

function App() {
  const [events, setEvents] = useState<MyEvent[]>([]);

  useEffect(() => {
    const containerEl = document.querySelector("#bolgeler");

    if (containerEl instanceof HTMLElement) {
      new Draggable(containerEl, {
        itemSelector: ".bolge",
        eventData: (eventEl) => {
          return {
            id: Math.floor(Math.random() * 1000).toString(),
            title: eventEl.innerText,
            color: window.getComputedStyle(eventEl).backgroundColor,
          };
        },
      });
    } else {
      console.error("Container element not found");
    }
  }, []);

  const handleEventDrop = (dropInfo: DropArg) => {
    const { draggedEl, date } = dropInfo;
    const title = draggedEl.innerText;
    const color = window.getComputedStyle(draggedEl).backgroundColor;

    const newEvent = {
      id: Math.floor(Math.random() * 1000).toString(),
      title,
      date: date.toISOString(),
      color,
    };

    setEvents((prevEvents) => [...prevEvents, newEvent]);

    console.log(events);
  };

  const handleEventRemove = (eventToRemoveId: string) => {
    setEvents((prevEvents) =>
      prevEvents.filter((event) => event.id !== eventToRemoveId)
    );
  };

  return (
    <>
      <div id="takvim">
        <FullCalendar
          windowResizeDelay={100}
          handleWindowResize={true}
          height={650}
          plugins={[timeGridPlugin, interactionPlugin]}
          slotLabelFormat={{
            hour: "2-digit",
            minute: "2-digit",
          }}
          editable={true}
          droppable={true}
          allDaySlot={false}
          dayHeaderFormat={{
            weekday: "long",
          }}
          locales={allLocales}
          locale={"tr"}
          buttonText={{
            today: "Bugün",
          }}
          events={{ events }}
          drop={() => handleEventDrop}
          eventClick={(info) => {
            if (
              window.confirm(
                `Are you sure you want to delete the event '${info.event.id}'?`
              )
            ) {
              handleEventRemove(info.event.id);
            }
          }}
        />
      </div>

      <div id="bolgeler">
        <p>
          <strong>Bölgeler</strong>
        </p>
        <div className="bolge" style={{ backgroundColor: "red" }}>
          Bölge 1
        </div>
        <div className="bolge" style={{ backgroundColor: "green" }}>
          Bölge 2
        </div>
        <div className="bolge" style={{ backgroundColor: "blue" }}>
          Bölge 3
        </div>
        <div className="bolge" style={{ backgroundColor: "orange" }}>
          Bölge 4
        </div>
        <div className="bolge" style={{ backgroundColor: "brown" }}>
          Bölge 5
        </div>
      </div>
    </>
  );
}
export default App;
