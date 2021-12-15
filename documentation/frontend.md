# Frontend

## Overview

The frontend web app is written in Typescript using node and React libraries.

In order to achieve the features, the following libraries are also used in the app:

- `react-beautiful-dnd` for drag and drop feature
- `react-loading-spinner` for loading spinner
- `bootstrap` for styling
- `lodash` for drag and drop logic

---

## Web app components

### Header

The app header contains a **Reset to Default** button and a **save status** component. The reset button is not included in the design specs but was a convenient development feature to test web app behaviours. The save status component shows the time since last save (formatted in seconds, minutes and hours for readability). A loading spinner also shows next to the text when saving is in progress.

### Cards

Cards are arranged in row containers with a maximum capacity of three cards each. This meets the design specs and also provides scalability when more cards are added (assuming cards are pushed to the next row once a row has three cards). It is achieved using flex boxes. The GIFs are saved locally on the web app and a spinner shows when the GIFs are loading. Each row is regarded as a separate droppable (drop region) in the drag and drop interaction.

### Overlay

On click of any of the cards, the overlay shows per the design specs. The overlay has a slightly transparent background greying out the screen and displays a bigger image. Sharing the same image component as the cards, the overlay would have a loading spinner on load of the GIFs. The **Delete Card** button is also added as an additional feature as suggested in the last part of the task.

---

## Web app logic

### Card display

All cards for display are cached as an array with the React `useState` hook, which triggers a re-render whenever the cards are updated. As described above about row containers, the next step in display logic is then to figure out the number of row containers needed and slice the array into arrays of cards per container. Actual display positions of cards depend on their indices in the cached array but not the position field of cards directly. Nonetheless, the array is sorted by position on every update.

### Drag and drop

The `react-beautiful-dnd` library has made drag and drop logic rather straightforward to implement as the indices of the source and destination are returned in each drag-drop action. Each action triggers the logic function to reorder the array of cards, then update the position field in each card object to match its index in the array for data consistency. After updating the array, the React hook would trigger the re-render and update the display.

### Overlay

On click of a card (at card component level), the overlay shows at app level which requires a callback reference. At the same time, when overlay is active, drag and drop feature should be disabled to avoid unintentional reordering of the cards. Both of these require reference being passed down to card level and a convenient way of achieving so is using the React `useContext` hook, which avoid passing the same references layer by layer. At the same time, to trigger re-rendering when overlay state changes, `isOverlayActive` and `overlayData` are both stored as states with the React `useState` hook.

### Load and save

In order to separate saving calls from user actions and avoid unnecessary saving calls, last saved cards must be stored for comparison which persist over app re-rendering. This is therefore achieved using the React `useRef` hook. On start of the app, the API is called to get all cards which is stored in both `cards` (for display) and `lastSavedCards` variables. Seconds since last save is kept using `useState` as update in its value should trigger a re-rendering for last updated time.

Logic for saving runs in a one-second sequence and the sequence is called once the previous sequence finishes (and `secondsSinceLastSave` changes) using the React `useEffect` hook. The sequence has the following stages:

1. check whether it is time to save and whether save is necessary
2. If so, save and reset the last save counter
3. If not, time one second then increase the counter
