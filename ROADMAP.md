
### Unstable
- Sanitize save file
- Delete: Removes tag for current page. If brings tags to zero, adds to recycle bin
  - Deleting from recycle bin permanently deletes the topic
- Add e2e tests with playwright
- Display errors in UI (not only in console)
- Make colors an implementation detail of API rather than exposing colors directly
- Truncate producer on display, with option to view full on hover
- Ensure accessibility
- Make tab order start at jar label and then go through each element
- Save jars across page reloads
- Make the page prettier
- Ensure adding jars work by communicating with grid, which controls the jars as a central controller
- Auto-focus new jar when it's created

### V1
- Add a help page
- Autosave option

### V2
- Allow for populating jars via a textbox

### V3
- Add multiple tabs, separate jar grid for each page

### Next

### Deployment
- Autodeploy via github pages
- Add CI hook to run tests

### Shortcuts

#### Actions
##### Tile level
- Add tile
- Delete tile
- Tag tile
- Tag remove tile
- Edit label
- Edit side n
  - Edit reaction
  - Edit intensity
  - Edit producer
- Select tile
  - Meta-click
  - Click the checkbox

##### Page level
- Switch to tag

#### Flow
When focused in a tile
Focused on the page

### Focus
After deleting an element, focus on the previous element
When adding an element, place after currently selected element (or at grid end)

