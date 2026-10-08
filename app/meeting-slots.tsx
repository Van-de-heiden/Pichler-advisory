"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent, type RefObject } from 'react';
import { MEETING_START_TIMES, slotInstant, type Slot } from '../lib/enquiry';
import { Icon } from './ui';
import './meeting-slots.css';

// Calendar arithmetic uses UTC only as a date container. Appointment instants
// are always resolved separately in Europe/Zurich, including summer time.
const dateValue = (date: string) => new Date(`${date}T12:00:00Z`);
const dateKey = (date: Date) => date.toISOString().slice(0, 10);
const addDays = (date: string, days: number) => dateKey(new Date(dateValue(date).getTime() + days * 86400000));
const dateLabel = (date: string) => date.split('-').reverse().join('.');
const fullDate = (date: string) => new Intl.DateTimeFormat('de-CH', { timeZone: 'UTC', weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(dateValue(date));
const lastStart = MEETING_START_TIMES[MEETING_START_TIMES.length - 1];
type Bounds = { min: string; max: string; now: number };
type Panel = { index: number; view: 'date' | 'time' };

function Calendar({ selected, min, max, onSelect }: { selected: string; min: string; max: string; onSelect: (date: string) => void }) {
  const initial = selected && selected >= min ? selected : min;
  const [month, setMonth] = useState(initial.slice(0, 7));
  const [focused, setFocused] = useState(initial);
  const focusPending = useRef(false);
  const daysRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const first = `${month}-01`;
  const start = dateValue(first);
  const offset = (start.getUTCDay() + 6) % 7;
  const dayCount = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + 1, 0)).getUTCDate();
  const monthLabel = new Intl.DateTimeFormat('de-CH', { timeZone: 'UTC', month: 'long', year: 'numeric' }).format(start);
  const focusDate = (date: string) => {
    const bounded = date < min ? min : date > max ? max : date;
    focusPending.current = true;
    setFocused(bounded); setMonth(bounded.slice(0, 7));
  };
  useEffect(() => { daysRef.current?.querySelector<HTMLButtonElement>('[tabindex="0"]')?.focus(); }, []);
  useEffect(() => {
    if (focusPending.current) {
      daysRef.current?.querySelector<HTMLButtonElement>(`[data-date="${focused}"]`)?.focus();
      focusPending.current = false;
    }
  }, [focused, month]);
  const changeMonth = (amount: number) => {
    const next = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + amount, 1, 12));
    focusDate(dateKey(next));
  };
  const keyboard = (event: KeyboardEvent<HTMLButtonElement>, date: string) => {
    const weekday = (dateValue(date).getUTCDay() + 6) % 7;
    const jumps: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7, Home: -weekday, End: 6 - weekday };
    if (event.key in jumps) { event.preventDefault(); focusDate(addDays(date, jumps[event.key])); }
    if (event.key === 'PageUp' || event.key === 'PageDown') { event.preventDefault(); changeMonth(event.key === 'PageUp' ? -1 : 1); }
  };

  return <div className="meeting-calendar" aria-labelledby={titleId}>
    <div className="calendar-heading"><strong id={titleId} aria-live="polite">{monthLabel}</strong><div>
      <button type="button" className="calendar-prev" aria-label="Vorheriger Monat" disabled={month <= min.slice(0, 7)} onClick={() => changeMonth(-1)}><Icon name="chevron" /></button>
      <button type="button" aria-label="Nächster Monat" disabled={month >= max.slice(0, 7)} onClick={() => changeMonth(1)}><Icon name="chevron" /></button>
    </div></div>
    <div className="calendar-weekdays" aria-hidden="true">{['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map(day => <span key={day}>{day}</span>)}</div>
    <div className="calendar-days" ref={daysRef} role="group" aria-label={`Tag wählen · ${monthLabel}`}>
      {Array.from({ length: offset }, (_, i) => <span key={`blank-${i}`} />)}
      {Array.from({ length: dayCount }, (_, i) => {
        const date = `${month}-${String(i + 1).padStart(2, '0')}`;
        return <button type="button" key={date} data-date={date} disabled={date < min || date > max} tabIndex={date === focused ? 0 : -1} aria-label={fullDate(date)} aria-pressed={date === selected} onFocus={() => setFocused(date)} onKeyDown={event => keyboard(event, date)} onClick={() => onSelect(date)}>{i + 1}</button>;
      })}
    </div>
    <p className="calendar-footer"><Icon name="calendar" />Montag bis Sonntag wählbar</p>
  </div>;
}

function TimeChoices({ slot, slots, index, now, onSelect }: { slot: Slot; slots: Slot[]; index: number; now: number; onSelect: (time: string) => void }) {
  const unavailable = (time: string) => slotInstant({ date: slot.date, time }) <= now || slots.some((other, i) => i !== index && other.date === slot.date && other.time === time);
  const firstAvailable = MEETING_START_TIMES.find(time => !unavailable(time)) || lastStart;
  const [period, setPeriod] = useState((slot.time || firstAvailable) < '12:00' ? 'morning' : 'afternoon');
  const panelRef = useRef<HTMLDivElement>(null);
  useEffect(() => { panelRef.current?.focus(); }, []);
  const times = MEETING_START_TIMES.filter(time => (time < '12:00') === (period === 'morning'));
  return <div className="meeting-times" tabIndex={-1} ref={panelRef} aria-label={`Uhrzeit für ${fullDate(slot.date)}`}>
    <div className="time-heading"><strong>Startzeit wählen</strong><span>{fullDate(slot.date)}</span></div>
    <div className="time-periods" role="group" aria-label="Tageszeit"><button type="button" aria-pressed={period === 'morning'} onClick={() => setPeriod('morning')}>Vormittag <span>07–12 Uhr</span></button><button type="button" aria-pressed={period === 'afternoon'} onClick={() => setPeriod('afternoon')}>Nachmittag <span>12–19 Uhr</span></button></div>
    <div className="time-options" role="group" aria-label="Startzeiten im 15-Minuten-Takt">{times.map(time => <button type="button" key={time} disabled={unavailable(time)} aria-pressed={time === slot.time} onClick={() => onSelect(time)}>{time}</button>)}</div>
    <p className="calendar-footer"><Icon name="clock" />30 Minuten · letzter Start um 18:30 Uhr</p>
  </div>;
}

export function MeetingSlots({ slots, onChange, bounds, invalid, fieldsetRef }: {
  slots: Slot[]; onChange: (slots: Slot[]) => void; bounds: Bounds; invalid: boolean; fieldsetRef: RefObject<HTMLFieldSetElement | null>;
}) {
  const [panel, setPanel] = useState<Panel | null>(null);
  const triggers = useRef(new Map<string, HTMLButtonElement>());
  const id = useId();
  const firstDate = bounds.min && slotInstant({ date: bounds.min, time: lastStart }) <= bounds.now ? addDays(bounds.min, 1) : bounds.min;
  const update = (index: number, value: Slot) => onChange(slots.map((slot, i) => i === index ? value : slot));
  const close = () => {
    if (panel) triggers.current.get(`${panel.index}-${panel.view}`)?.focus();
    setPanel(null);
  };
  const open = (index: number, view: Panel['view']) => setPanel(current => current?.index === index && current.view === view ? null : { index, view });

  return <fieldset className="slot-picker" ref={fieldsetRef} aria-describedby={`${id}-note`} onKeyDown={event => { if (event.key === 'Escape' && panel) { event.preventDefault(); close(); } }}>
    <legend>Ihre Wunschtermine</legend>
    <div className="meeting-availability"><Icon name="calendar" /><strong>Mo–So</strong><span>07:00–19:00 Uhr</span></div>
    <p className="slot-note" id={`${id}-note`}>Schweizer Zeit (Zürich) · Auswahl alle 15 Minuten</p>
    <div className="wish-slots">{slots.map((slot, index) => {
      const active = panel?.index === index;
      const complete = !!slot.date && !!slot.time;
      return <div className={`wish-slot${active ? ' is-open' : ''}`} key={index}>
        <div className="wish-slot-heading"><span className="wish-slot-number">0{index + 1}</span><strong>{index + 1}. Wunschtermin{index === 2 && <span> · optional</span>}</strong>{complete && <Icon name="check" />}{index === 2 && <button type="button" className="remove-slot" aria-label="Dritten Wunschtermin entfernen" onClick={() => { onChange(slots.slice(0, 2)); setPanel(null); triggers.current.get('1-date')?.focus(); }}><Icon name="close" /></button>}</div>
        <div className="slot-fields">{(['date', 'time'] as const).map(view => {
          const selected = active && panel.view === view;
          return <button type="button" key={view} className="slot-trigger" ref={element => { if (element) triggers.current.set(`${index}-${view}`, element); else triggers.current.delete(`${index}-${view}`); }}
            disabled={!firstDate || (view === 'time' && !slot.date)} aria-expanded={selected} aria-controls={selected ? `${id}-panel-${index}` : undefined} aria-invalid={invalid && !slot[view] ? true : undefined}
            aria-label={`${view === 'date' ? 'Datum' : 'Uhrzeit'} ${index + 1}: ${slot[view] ? view === 'date' ? fullDate(slot.date) : `${slot.time} Uhr` : 'wählen'}`} onClick={() => open(index, view)}>
            <span><small>{view === 'date' ? 'Datum' : 'Startzeit'}</small><span className={slot[view] ? 'has-value' : ''}>{slot[view] ? view === 'date' ? dateLabel(slot.date) : `${slot.time} Uhr` : view === 'date' ? 'Datum wählen' : 'Zeit wählen'}</span></span><Icon name={view === 'date' ? 'calendar' : 'clock'} />
          </button>;
        })}</div>
        {active && firstDate && <div className="slot-panel" id={`${id}-panel-${index}`}>
          <div className="slot-panel-top"><span>{panel.view === 'date' ? 'Datum wählen' : 'Schweizer Zeit · 24-Stunden-Format'}</span><button type="button" aria-label="Auswahl schliessen" onClick={close}><Icon name="close" /></button></div>
          {panel.view === 'date' ? <Calendar key={`date-${index}`} selected={slot.date} min={firstDate} max={bounds.max} onSelect={date => {
            const time = slot.time && slotInstant({ date, time: slot.time }) > bounds.now && !slots.some((other, i) => i !== index && other.date === date && other.time === slot.time) ? slot.time : '';
            update(index, { date, time }); setPanel({ index, view: 'time' });
          }} /> : <TimeChoices key={`time-${index}-${slot.date}`} slot={slot} slots={slots} index={index} now={bounds.now} onSelect={time => { update(index, { ...slot, time }); close(); }} />}
        </div>}
      </div>;
    })}</div>
    {slots.length < 3 && <button type="button" className="add-slot" onClick={() => { onChange([...slots, { date: '', time: '' }]); setPanel({ index: 2, view: 'date' }); }}><Icon name="plus" />Dritten Wunschtermin hinzufügen</button>}
  </fieldset>;
}
