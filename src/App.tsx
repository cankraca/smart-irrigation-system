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
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Button, Dropdown, DropdownButton, Form, Modal } from "react-bootstrap";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";

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
  const [timeline, setTimeLine] = useState<number>(15);
  const [timelineForm, setTimelineForm] = useState<boolean>(false);

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
                  <Button
                    variant="link"
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
                  </Button>
                </div>
              </div>
            );
          }}
          headerToolbar={{
            start: "title",
            end: "timelineButton",
          }}
          windowResizeDelay={100}
          handleWindowResize={true}
          plugins={[timeGridPlugin, interactionPlugin]}
          slotLabelFormat={{
            hour: "2-digit",
            minute: "2-digit",
          }}
          slotDuration={`00:${timeline}:00 `}
          selectable={true}
          editable={true}
          droppable={true}
          allDaySlot={false}
          forceEventDuration={true}
          dayHeaderClassNames="calendar-headers"
          dayHeaderFormat={{
            weekday: "long",
          }}
          locales={allLocales}
          locale={"tr"}
          events={{ events }}
          drop={(info) => handleEventDrop(info)}
          customButtons={{
            timelineButton: {
              text: "Zaman Aralığı",
              click: () => {
                setTimelineForm(!timelineForm);
              },
            },
          }}
        />
      </div>

      <div id="bolgeler">
        <div id="bolge-baslik">
          <strong>Bölgeler</strong>

          <Button
            size="sm"
            id="open-form-button"
            variant="primary"
            onClick={() => setFormVisibility(!formVisibility)}
          >
            <FontAwesomeIcon icon={faPlus} />
          </Button>
        </div>

        {anyArea || (
          <p style={{ textAlign: "center", marginTop: 20 }}>
            Kayıtlı Bölge Bulunmamaktadır.
          </p>
        )}
      </div>
      <Modal
        onHide={() => setFormVisibility(!formVisibility)}
        show={formVisibility}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Yeni Bölge Ekle</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddNewRegion}>
            <Form.Group>
              <Form.Label>Bölge Adı:</Form.Label>
              <Form.Control
                id="bolgeAdi"
                type="text"
                placeholder="Bölge adını giriniz"
                required
              ></Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Renk:</Form.Label>
              <Form.Control type="color" id="bolgeRenk"></Form.Control>
            </Form.Group>
            <Button variant="primary" type="submit" id="add-region-button">
              Ekle
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal
        show={timelineForm}
        onHide={() => setTimelineForm(!timelineForm)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Yeni Zaman Aralığı Belirleyin</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Değer: {timeline}</Form.Label>
              <Form.Range
                defaultValue={timeline}
                min={10}
                max={60}
                onChange={(e) => setTimeLine(parseInt(e.target.value))}
              ></Form.Range>
            </Form.Group>
            <Button
              id="close-range-form"
              onClick={() => setTimelineForm(!timelineForm)}
            >
              Kapat
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}
export default App;
