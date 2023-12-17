import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, {
  Draggable,
  DropArg,
} from "@fullcalendar/interaction";
import allLocales from "@fullcalendar/core/locales-all";
import React, { useEffect, useState } from "react";
import { EventImpl } from "@fullcalendar/core/internal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faXmark } from "@fortawesome/free-solid-svg-icons";

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
  const [anyArea, setAnyArea] = useState<boolean>(false);
  const [formVisibility, setFormVisibility] = useState<boolean>(false);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setFormVisibility(false);
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

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

    console.log(events); //debugging
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

  const handleEventRemove = (info: EventImpl) => {
    info.remove();
    setEvents((prevEvents) =>
      prevEvents.filter((event) => event.id !== info.id)
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
      setAnyArea(true);
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
    } else {
      setAnyArea(false);
    }
  };

  const AlertFunc = () => {
    alert("Merhaba");
  };
  return (
    <>
      <div id="takvim">
        <FullCalendar
          eventContent={(eventInfo) => {
            return (
              <div className="event-wrapper">
                <div className="event-details">
                  <div>{eventInfo.timeText}</div>
                  <div>{eventInfo.event.title}</div>
                </div>

                <div>
                  <button
                    id="event-delete-button"
                    onClick={() => {
                      if (
                        window.confirm(
                          `Şeçili bölgeyi silmek istediğinizden emin misiniz?`
                        )
                      ) {
                        handleEventRemove(eventInfo.event);
                      }
                    }}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </div>
            );
          }}
          headerToolbar={{
            start: "title",
            end: "",
          }}
          windowResizeDelay={100}
          handleWindowResize={true}
          plugins={[timeGridPlugin, interactionPlugin]}
          slotLabelFormat={{
            hour: "2-digit",
            minute: "2-digit",
          }}
          slotDuration={"00:15:00"}
          selectable={true}
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
        />
      </div>

      <div id="bolgeler">
        <div id="bolge-baslik">
          <strong>Bölgeler</strong>

          <button id="bolgeEkle" onClick={handleOpenForm}>
            <FontAwesomeIcon icon={faPlus} />
          </button>
        </div>

        {anyArea || (
          <p style={{ textAlign: "center" }}> Kayıtlı Bölge Bulunmamaktadır.</p>
        )}
      </div>

      <form
        id="popupform"
        className="popup-form"
        onSubmit={handleAddNewRegion}
        style={{ display: formVisibility ? "block" : "none" }}
      >
        <h2>Yeni Bölge Ekle</h2>
        <label htmlFor="bolgeAdi">Bölge Adı: </label>
        <input type="text" id="bolgeAdi" name="bolgeAdi" required />
        <label htmlFor="bolgeRenk">Bölge Rengi: </label>
        <input type="color" id="bolgeRenk" name="bolgeRenk" />
        <input type="submit" value="Ekle" />
        <button type="button" className="close-button" onClick={AlertFunc}>
          <FontAwesomeIcon icon={faXmark} />
        </button>
      </form>
    </>
  );
}
export default App;
