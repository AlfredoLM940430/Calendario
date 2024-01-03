import { useDispatch, useSelector } from "react-redux"
import { onAddNewEvent, onDeleteEvent, onLoadEvents, onSetActiveEvent, onUpdateEvent } from "../store/calendar/calendarSlice";
import calendarApi from "../api/CalendarApi";
import { convertDate } from "../helpers";
import Swal from "sweetalert2";

export const useCalendarStore = () => {

    const {events, activeEvent} = useSelector(state => state.calendar);
    const {user} = useSelector(state => state.auth);
    const dispatch = useDispatch();

    const setActiveEvent = (calendarEvent) => {
        dispatch(onSetActiveEvent(calendarEvent));
    }

    const starSavingEvent = async (calendarEvent) => {

        try {
            if(calendarEvent.id) {
                // Actualizando
                await calendarApi.put(`events/${calendarEvent.id}`, calendarEvent);
                dispatch(onUpdateEvent({...calendarEvent, user}));
                return;
            }
    
            // Creando
            const {data} = await calendarApi.post('/events', calendarEvent);
            dispatch(onAddNewEvent({...calendarEvent, id: data.evento.id, user}))
     
        } catch (error) {
            console.log(error);
            Swal.fire('Error al guardar', error.response.data.msg, 'error');
        }
    }

    const starDeleteEvent = async() => {

        try { 
            // Eliminando
            await calendarApi.delete(`/events/${activeEvent.id}`);
            dispatch(onDeleteEvent());
     
        } catch (error) {
            console.log(error);
            Swal.fire('Error al eliminar', error.response.data.msg, 'error');
        }
    }

    const startLoadingEvents = async() => {
        try {
            const {data} = await calendarApi.get('/events');
            const events = convertDate(data.eventos);
            dispatch(onLoadEvents(events))
            
        } catch (error) {
            console.log(error);
        }
    }
    
    return {
        activeEvent,
        events,
        hasEventSelected: !!activeEvent,

        setActiveEvent,
        starSavingEvent,
        starDeleteEvent,
        startLoadingEvents,
    }
}