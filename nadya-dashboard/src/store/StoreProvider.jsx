// App-wide state: loads every slice from localStorage once, exposes
// write-through actions (state update + persist in the same call).
// Components never touch models/storage directly — this keeps the
// persistence seam swappable (cloud sync later) without UI changes.
import { createContext, useCallback, useContext, useMemo, useState } from "react";
import * as activitiesModel from "../models/activities.js";
import * as habitsModel from "../models/habits.js";
import * as savingsModel from "../models/savings.js";
import * as journalModel from "../models/journal.js";
import * as settingsModel from "../models/settings.js";
import * as storage from "../lib/storage.js";
import { monthKey, monthKeyOf } from "../lib/dates.js";
import { uid } from "../lib/uid.js";

const StoreContext = createContext(null);

export function useStore() {
  return useContext(StoreContext);
}

export function StoreProvider({ children }) {
  const [settings, setSettingsState] = useState(() => settingsModel.getSettings());
  const [categories, setCategoriesState] = useState(() => settingsModel.getCategories());
  const [meta, setMetaState] = useState(() => settingsModel.getMeta());
  const [habits, setHabitsState] = useState(() => habitsModel.getHabits());
  const [habitLog, setHabitLogState] = useState(() => habitsModel.getLog());
  const [savings, setSavingsState] = useState(() => savingsModel.getSavings());
  const [journal, setJournalState] = useState(() => journalModel.getJournal());
  // Activity shards, loaded lazily: { "YYYY-MM": { "YYYY-MM-DD": [entry] } }
  const [months, setMonthsState] = useState(() => {
    const m = monthKey();
    return { [m]: activitiesModel.getMonth(m) };
  });

  /** Make sure the given "YYYY-MM" shards are loaded into state. */
  const ensureMonths = useCallback((mKeys) => {
    setMonthsState((prev) => {
      const missing = mKeys.filter((k) => !(k in prev));
      if (!missing.length) return prev;
      const next = { ...prev };
      for (const k of missing) next[k] = activitiesModel.getMonth(k);
      return next;
    });
  }, []);

  // ---- activities ----

  const logActivity = useCallback(({ dateKey, categoryId, minutes, note = "" }) => {
    const entry = { id: uid(), categoryId, minutes, note, at: Date.now() };
    const shard = activitiesModel.addEntry(dateKey, entry);
    setMonthsState((prev) => ({ ...prev, [monthKeyOf(dateKey)]: shard }));
    return entry;
  }, []);

  const deleteActivity = useCallback((dateKey, id) => {
    const shard = activitiesModel.removeEntry(dateKey, id);
    setMonthsState((prev) => ({ ...prev, [monthKeyOf(dateKey)]: shard }));
  }, []);

  /** Patch may include a new dateKey (backdating moves the entry). */
  const updateActivity = useCallback((oldDateKey, id, patch) => {
    const oldShard = activitiesModel.getMonth(monthKeyOf(oldDateKey));
    const entry = (oldShard[oldDateKey] || []).find((e) => e.id === id);
    if (!entry) return;
    const nextDateKey = patch.dateKey || oldDateKey;
    const nextEntry = { ...entry, ...patch };
    delete nextEntry.dateKey;
    const removed = activitiesModel.removeEntry(oldDateKey, id);
    const added = activitiesModel.addEntry(nextDateKey, nextEntry);
    setMonthsState((prev) => ({
      ...prev,
      [monthKeyOf(oldDateKey)]: monthKeyOf(oldDateKey) === monthKeyOf(nextDateKey) ? added : removed,
      [monthKeyOf(nextDateKey)]: added,
    }));
  }, []);

  // ---- focus timer: { categoryId, startedAt } | null, survives reloads ----

  const [timer, setTimerState] = useState(() => storage.get("timer"));

  const startTimer = useCallback((categoryId) => {
    const t = { categoryId, startedAt: Date.now() };
    storage.set("timer", t);
    setTimerState(t);
  }, []);

  const stopTimer = useCallback(() => {
    const t = storage.get("timer");
    storage.remove("timer");
    setTimerState(null);
    return t;
  }, []);

  // ---- categories / settings / meta ----

  const updateSettings = useCallback((patch) => {
    setSettingsState((prev) => {
      const next = { ...prev, ...patch };
      settingsModel.setSettings(next);
      return next;
    });
  }, []);

  const saveCategories = useCallback((next) => {
    settingsModel.setCategories(next);
    setCategoriesState(next);
  }, []);

  const patchMeta = useCallback((patch) => {
    setMetaState(settingsModel.patchMeta(patch));
  }, []);

  // ---- habits ----

  const saveHabits = useCallback((next) => {
    habitsModel.setHabits(next);
    setHabitsState(next);
  }, []);

  const toggleHabitTick = useCallback((dateKey, habitId) => {
    setHabitLogState((prev) => {
      const day = prev[dateKey] || [];
      const ticked = day.includes(habitId);
      const nextDay = ticked ? day.filter((id) => id !== habitId) : [...day, habitId];
      const next = { ...prev };
      if (nextDay.length) next[dateKey] = nextDay;
      else delete next[dateKey];
      habitsModel.setLog(next);
      return next;
    });
  }, []);

  // ---- savings ----

  const setMonthGoal = useCallback((mKey, goal) => {
    setSavingsState((prev) => {
      const month = prev.months[mKey] || { goal: 0, entries: [] };
      const next = {
        ...prev,
        defaultGoal: goal,
        months: { ...prev.months, [mKey]: { ...month, goal } },
      };
      savingsModel.setSavings(next);
      return next;
    });
  }, []);

  const upsertSavingsEntry = useCallback((mKey, entry) => {
    setSavingsState((prev) => {
      const month = prev.months[mKey] || { goal: prev.defaultGoal || 0, entries: [] };
      const exists = month.entries.some((e) => e.id === entry.id);
      const entries = exists
        ? month.entries.map((e) => (e.id === entry.id ? entry : e))
        : [...month.entries, entry];
      const next = { ...prev, months: { ...prev.months, [mKey]: { ...month, entries } } };
      savingsModel.setSavings(next);
      return next;
    });
  }, []);

  const deleteSavingsEntry = useCallback((mKey, id) => {
    setSavingsState((prev) => {
      const month = prev.months[mKey];
      if (!month) return prev;
      const next = {
        ...prev,
        months: {
          ...prev.months,
          [mKey]: { ...month, entries: month.entries.filter((e) => e.id !== id) },
        },
      };
      savingsModel.setSavings(next);
      return next;
    });
  }, []);

  // ---- journal ----

  const saveJournalEntry = useCallback((dateKey, entry) => {
    setJournalState((prev) => {
      const next = { ...prev, [dateKey]: { ...entry, updatedAt: Date.now() } };
      journalModel.setJournal(next);
      return next;
    });
  }, []);

  const deleteJournalEntry = useCallback((dateKey) => {
    setJournalState((prev) => {
      const next = { ...prev };
      delete next[dateKey];
      journalModel.setJournal(next);
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({
      settings,
      categories,
      meta,
      habits,
      habitLog,
      savings,
      journal,
      months,
      timer,
      startTimer,
      stopTimer,
      ensureMonths,
      logActivity,
      deleteActivity,
      updateActivity,
      updateSettings,
      saveCategories,
      patchMeta,
      saveHabits,
      toggleHabitTick,
      setMonthGoal,
      upsertSavingsEntry,
      deleteSavingsEntry,
      saveJournalEntry,
      deleteJournalEntry,
    }),
    [settings, categories, meta, habits, habitLog, savings, journal, months,
      timer, startTimer, stopTimer,
      ensureMonths, logActivity, deleteActivity, updateActivity, updateSettings,
      saveCategories, patchMeta, saveHabits, toggleHabitTick,
      setMonthGoal, upsertSavingsEntry, deleteSavingsEntry, saveJournalEntry,
      deleteJournalEntry],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}
