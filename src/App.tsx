import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, {
  Draggable,
  DropArg,
} from "@fullcalendar/interaction";
import allLocales from "@fullcalendar/core/locales-all";
import React, { useEffect, useRef, useState } from "react";
import { EventImpl } from "@fullcalendar/core/internal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Button, Form, Modal } from "react-bootstrap";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";

interface MyEvent {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  color: string;
}

function App() {
  const [anyArea, setAnyArea] = useState<boolean>(false);
  const [formVisibility, setFormVisibility] = useState<boolean>(false);
  const [timeline, setTimeLine] = useState<number>(15);
  const [timelineForm, setTimelineForm] = useState<boolean>(false);
  const calendarRef = useRef<FullCalendar>(null);

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

        return event;
      },
    });

  
    return () => {
      draggable.destroy();
    };
  }, []);

  const handleEventRemove = (info: EventImpl) => {
    info.remove();
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
  const handleUpdateCalendar = () => {
    if (calendarRef.current) {
      const getApi = calendarRef.current.getApi();
      console.log(getApi.getEvents().map((i) => i.toJSON()));
    } else {
      console.log("Current yok");
    }
  };
  return (
    <>
      <div id="takvim">
        <FullCalendar
          ref={calendarRef}
          eventContent={(eventInfo) => {
            return (
              <div className="event-wrapper">
                <div className="event-details">
                  <div>{eventInfo.timeText}</div>
                  <div>{eventInfo.event.title}</div>
                </div>

                <div>
                  <Button
                    size="sm"
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
          // defaultTimedEventDuration={"00:45"}
          headerToolbar={{
            start: "title",
            end: "updateButton timelineButton",
          }}
          windowResizeDelay={100}
          handleWindowResize={true}
          plugins={[timeGridPlugin, interactionPlugin]}
          slotLabelFormat={{
            hour: "2-digit",
            minute: "2-digit",
          }}
          slotDuration={`00:${String("0" + timeline).slice(-2)}:00 `}
          editable={true}
          droppable={true}
          allDaySlot={false}
          forceEventDuration={true}
          dayHeaderFormat={{
            weekday: "long",
          }}
          locales={allLocales}
          locale={"tr"}
          //events={{ events }}
          customButtons={{
            timelineButton: {
              text: "Zaman Aralığı",
              click: () => {
                setTimelineForm(!timelineForm);
              },
            },
            updateButton: {
              text: "Takvim Güncelle",
              click: () => {
                handleUpdateCalendar();
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
              <Form.Label>Değer: {timeline} dakika</Form.Label>
              <Form.Range
                defaultValue={timeline}
                min={5}
                max={30}
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
