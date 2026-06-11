// journal = { "YYYY-MM-DD": { grateful: ["", "", ""], highlight: "", updatedAt } }
import * as storage from "../lib/storage.js";

export function getJournal() {
  return storage.get("journal", {});
}

export function setJournal(journal) {
  storage.set("journal", journal);
}
