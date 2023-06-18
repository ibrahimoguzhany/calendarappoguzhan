import React, { useState, useRef } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "./styles.css";
import CustomTuiCalendar from "./CustomTuiCalendar";
import CustomTuiModal from "./CustomTuiModal";
import { useUser } from "../lib/customHooks";

const start = new Date();
const end = new Date(new Date().setMinutes(start.getMinutes() + 60));
const attendees = [
  {
    id: "1",
    name: "Oguzhan",
  },
  { id: "2", name: "Cerem" },
  { id: "3", name: "Baris" },
  { id: "4", name: "Feriha" },
];
const schedules = [
  {
    id: "1",
    title: "İbrahimle Görüşme",
    calendarId: "1",
    category: "time",
    isVisible: true,
    start,
    end,
  },
  {
    id: "2",
    title: "Oğuzhanla toplantı",
    calendarId: "2",
    category: "time",
    isVisible: true,
    start: new Date(new Date().setHours(start.getHours() + 1)),
    end: new Date(new Date().setHours(start.getHours() + 2)),
  },
  {
    id: "3",
    title: "Cerenle gezi",
    calendarId: "3",
    category: "time",
    isVisible: true,
    start: new Date(new Date().setHours(start.getHours() + 2)),
    end: new Date(new Date().setHours(start.getHours() + 4)),
  },
  {
    id: "4",
    title: "Barışla yemek",
    calendarId: "4",
    category: "time",
    isVisible: true,
    start: new Date(new Date().setHours(start.getHours() + 2)),
    end: new Date(new Date().setHours(start.getHours() + 6)),
  },
];

const colors = [
  {
    id: "1",
    color: "#ffffff",
    bgColor: "#34C38F",
    dragBgColor: "#34C38F",
    borderColor: "#34C38F",
  },
  {
    id: "2",
    color: "#ffffff",
    bgColor: "#F4696A",
    dragBgColor: "#F4696A",
    borderColor: "#F4696A",
  },
  {
    id: "3",
    color: "#ffffff",
    bgColor: "#00a9ff",
    dragBgColor: "#00a9ff",
    borderColor: "#00a9ff",
  },
  {
    id: "4",
    color: "#ffffff",
    bgColor: "#F2B34C",
    dragBgColor: "#F2B34C",
    borderColor: "#F2B34C",
  },
  {
    id: "5",
    color: "#ffffff",
    bgColor: "#74788D",
    dragBgColor: "#74788D",
    borderColor: "#74788D",
  },
  {
    id: "6",
    color: "#ffffff",
    bgColor: "#343A40",
    dragBgColor: "#343A40",
    borderColor: "#343A40",
  },
  {
    id: "7",
    color: "#000000",
    bgColor: "#FFFFFF",
    dragBgColor: "#FFFFFF",
    borderColor: "#FFFFFF",
  },
];

const calendars = [
  {
    id: "1",
    name: "Teknik",
  },
  {
    id: "2",
    name: "Temizlik",
  },
  {
    id: "3",
    name: "Aquapark",
  },
  {
    id: "4",
    name: "İş Toplantısı",
  },
  {
    id: "5",
    name: "Yemek",
  },
  {
    id: "6",
    name: "Gezi",
  },
  {
    id: "7",
    name: "Tatil",
  },
];

export default function Calendar() {
  const { user, authenticated } = useUser();
  const [modal, setModal] = useState(false);
  const [event, setEvent] = useState(null);
  const childRef = useRef();

  if (!user || !authenticated) {
    return (
      <div className="p-16 bg-gray-800 h-screen">
        <div className="text-2xl mb-4 font-bold text-white">Dashboard</div>
        <div className="ml-2 w-8 h-8 border-l-2 rounded-full animate-spin border-white" />
      </div>
    );
  }

  const toggle = () => {
    setModal(!modal);
    setEvent(null);
  };

  function onBeforeCreateSchedule(event) {
    // console.log('onBeforeCreateSchedule', event)
    event.guide.clearGuideElement();
    setModal(true);
    setEvent(event);
  }

  function handleCreateSchedule(newEvent) {
    // call api
    const result = true;

    if (result) {
      const newSchedule = {
        ...event,
        id: schedules.length,
        title: newEvent.title,
        calendarId: newEvent.calendarId,
        category: event.isAllDay ? "allday" : "time",
        attendees: newEvent.attendees,
        isVisible: true,
        start: newEvent.start,
        end: newEvent.end,

        isAllDay: event.isAllDay,
        dueDateClass: "",
        location: event.location,
        // raw: {
        //   class: event.raw["class"]
        // },
        state: event.state,
        body: event.body,
      };

      childRef.current.createSchedule(newSchedule);
      setModal(false);
    }
  }

  function onBeforeUpdateSchedule(event) {
    // console.log('onBeforeUpdateSchedule', event)

    const { schedule, changes } = event;
    console.log(event)
    // resize & drag n drop
    if (changes) {
      // call api
      const result = true;
      if (result) {
        return childRef.current.updateSchedule(schedule, changes);
      }
    }

    setModal(true);
    setEvent(event);
  }

  async function handleUpdateSchedule(updateEvent) {
    // call api
    const result = true;

    if (result) {
      const { schedule } = event;

      // way 1: library not support
      // update api fail with attendees
      // childRef.current.updateSchedule(schedule, updateEvent)

      // way 2: stupid
      await childRef.current.deleteSchedule(schedule);

      const newSchedule = {
        ...event,
        id: schedules.length + 2,
        title: updateEvent.title,
        calendarId: updateEvent.calendarId,
        category: event.isAllDay ? "allday" : "time",
        attendees: updateEvent.attendees,
        isVisible: true,
        start: updateEvent.start,
        end: updateEvent.end,

        isAllDay: event.isAllDay,
        dueDateClass: "",
        location: event.location,
        // raw: {
        //   class: event.raw["class"]
        // },
        state: event.state,
        body: event.body,
      };

      await childRef.current.createSchedule(newSchedule);

      setModal(false);
    }
  }

  function onBeforeDeleteSchedule(event) {
    // console.log('onBeforeDeleteSchedule', event)

    // call api
    const result = true;

    if (result) {
      const { schedule } = event;
      childRef.current.deleteSchedule(schedule);
    }

    return true;
  }

  const formatCalendars = calendars.map((element) => ({
    ...colors.find((element2) => element2.id === element.id),
    ...element,
  }));

  return (
    <div>
      <CustomTuiCalendar
        ref={childRef}
        {...{
          isReadOnly: false,
          showSlidebar: false,
          showMenu: true,
          useCreationPopup: false,
          // onCreate: () => {
          //   console.log("create that!!!");
          //   childRef.current.getAlert();
          // },
          // createText: "Tao moi",
          calendars: formatCalendars,
          schedules,
          onBeforeCreateSchedule,
          onBeforeUpdateSchedule,
          onBeforeDeleteSchedule,
        }}
      />
      <CustomTuiModal
        {...{
          isOpen: modal,
          toggle,
          onSubmit:
            event?.triggerEventName === "mouseup"
              ? handleCreateSchedule
              : handleUpdateSchedule,
          submitText: event?.triggerEventName === "mouseup" ? "Save" : "Update",
          calendars: formatCalendars,
          attendees,
          schedule: event?.schedule,
          startDate: event?.start,
          endDate: event?.end,
        }}
      />
    </div>
  );
}
