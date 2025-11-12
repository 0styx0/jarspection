

`index.html`:
- Imports components: Enables referencing them throughout the project

### Component structure

`JarPage`
- `JarPageControls`
  - `JarImporter`
  - `JarExporter`
- `JarGrid`
  - `JarTile`
  - `AddJar`

### Component communication
- Simple messages:
  - Usecase: Props are primitives
  - Parent sets string props
  - Child communicates with parent via custom events
- Complex messages:
  - Usecase: Child requires complex data passed from parent
  - Child implements `setProps`
  - Parent programatically creates child via JS's `createElement`
  - Parent calls child's `setProps` with all props (even if only some props are complex data)

### Behavior
1. User loads the page: Default jars load
1. User creates a new jar
1. Import jars: From JSON file. Format: `ContainerSettings`
1. Export jars: Downloads JSON file
