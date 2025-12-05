
import { PeriodicElement } from "../types";
import { VILLAGER_NOTES } from "../villagerNotes";

// This service now fetches pre-written villager notes instead of using AI generation.
// This ensures fast response times and consistent character personality.

export const generateVillagerExplanation = async (element: PeriodicElement): Promise<string> => {
  // console.log(`[Villager Service] Fetching static note for element: ${element.name} (${element.symbol})`);
  
  // Lookup in static database
  const noteData = VILLAGER_NOTES.find(n => n.element === element.symbol);
  
  if (noteData) {
    // Randomly select one of the 3 notes to add variety
    const options = [noteData.note_1, noteData.note_2, noteData.note_3];
    const selectedNote = options[Math.floor(Math.random() * options.length)];
    return selectedNote;
  }
  
  // Fallback if not found in static data
  return "噢！我的腦袋感覺毛毛的。現在記不起來那個元素。啪嗒！";
};
