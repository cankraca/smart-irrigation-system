import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, {
  Draggable,
  DropArg,
} from "@fullcalendar/interaction";
import allLocales from "@fullcalendar/core/locales-all";
import React, { useEffect, useState } from "react";
import { EventClickArg } from "@fullcalendar/core";
interface MyEvent {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  color: string;
}

function App() {
  const [events, setEvents] = useState<MyEvent[]>([]);
  const [newEvent, setNewEvent] = useState<MyEvent>();
  const [formVisibility, setFormVisibility] = useState<boolean>(false);

  useEffect(() => {
    const containerEl = document.querySelector("#bolgeler") as HTMLElement;

    const draggable = new Draggable(containerEl, {
      itemSelector: ".bolge",
      eventData: (eventEl) => {
        const event: MyEvent = {
          id: Math.floor(Math.random() * 1000).toString(),
          title: eventEl.innerText,
          color: window.getComputedStyle(eventEl).backgroundColor,
          startTime: "",
          endTime: "",
        };

        setNewEvent(event);
        return event;
      },
    });

    console.log(events);
    return () => {
      draggable.destroy();
    };
  }, [events]);

  const handleEventDrop = (info: DropArg) => {
    if (newEvent) {
      const eventWithDate: MyEvent = {
        ...newEvent,
        startTime: info.dateStr,
      };
      setEvents((prevEvents) => [...prevEvents, eventWithDate]);
      setNewEvent(undefined);
    }
  };

  const handleEventRemove = (info: EventClickArg) => {
    info.event.remove();
    setEvents((prevEvents) =>
      prevEvents.filter((event) => event.id !== info.event.id)
    );
  };

  const handleOpenForm = () => {
    const popupButton = document.getElementById("bolgeEkle");
    const popupForm = document.getElementById("popupform");

    if (popupButton && popupForm) {
      popupButton.addEventListener("click", (event) => {
        event.stopPropagation();
        setFormVisibility(true);
      });

      window.addEventListener("click", (event) => {
        if (event.target !== popupButton) {
          setFormVisibility(false);
        }
      });

      popupForm.addEventListener("click", (event) => {
        event.stopPropagation();
      });
    }
  };

  const handleAddNewRegion = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const bolgelerDiv = document.getElementById("bolgeler");

    if (bolgelerDiv) {
      const yeniBolge = document.createElement("div");

      const yeniBolgeIsim = document.getElementById(
        "bolgeAdi"
      ) as HTMLInputElement;

      const yeniBolgeRenk = document.getElementById(
        "bolgeRenk"
      ) as HTMLInputElement;

      yeniBolge.textContent = yeniBolgeIsim.value;
      yeniBolge.style.backgroundColor = yeniBolgeRenk.value;

      yeniBolge.classList.add("bolge");
      bolgelerDiv.appendChild(yeniBolge);

      yeniBolgeIsim.value = "";
      yeniBolgeRenk.value = "";

      setFormVisibility(false);
    }
  };
  return (
    <>
      <div id="takvim">
        <FullCalendar
          headerToolbar={{
            start: "title",
            end: "",
          }}
          eventMouseEnter={(info) => {
            info.el.classList.add("event-hover");
            const button = document.createElement("button");
            button.innerText = "Click!";

            info.el.appendChild(button);
          }}
          eventMouseLeave={(info) => {
            info.el.classList.remove("event-hover");
            const button = info.el.querySelector("button");
            if (button) {
              button.remove();
            }
          }}
          windowResizeDelay={100}
          handleWindowResize={true}
          height={650}
          plugins={[timeGridPlugin, interactionPlugin]}
          slotLabelFormat={{
            hour: "2-digit",
            minute: "2-digit",
          }}
          slotDuration={"00:15:00"}
          editable={true}
          droppable={true}
          allDaySlot={false}
          forceEventDuration={true}
          dayHeaderFormat={{
            weekday: "long",
          }}
          locales={allLocales}
          locale={"tr"}
          events={{ events }}
          drop={(info) => handleEventDrop(info)}
          eventClick={(info) => {
            if (
              window.confirm(
                `Are you sure you want to delete the event '${info.event.id}'?`
              )
            ) {
              handleEventRemove(info);
            }
          }}
        />
      </div>

      <div id="bolgeler">
        <p>
          <strong>Bölgeler</strong>
        </p>
        <button id="bolgeEkle" onClick={handleOpenForm}>
          Yeni
        </button>
      </div>
      <form
        id="popupform"
        className="popup-form"
        style={{ display: formVisibility ? "block" : "none" }}
        onSubmit={handleAddNewRegion}
      >
        <label htmlFor="bolgeAdi">Bölge Adı: </label>
        <input type="text" id="bolgeAdi" name="bolgeAdi" />
        <br />
        <label htmlFor="bolgeRenk">Bölge Rengi: </label>
        <input type="color" id="bolgeRenk" name="bolgeRenk" />
        <br />
        <input type="submit" value="Ekle" />
      </form>
    </>
  );
}
export default App;
