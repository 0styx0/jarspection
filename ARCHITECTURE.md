

`index.html`:
- Imports components: Enables referencing them throughout the project

### Component structure

JarTile: The controller
- Interfaces with subcomponents (eg, color controller, jar illustration)
- Syncs subcomponent state together (eg, when color controller changes color, the jar color changes too)

Subcomponents: Sends events to JarTile on state changes

### Behavior
1. User loads the page: Default jars load
1. User creates a new jar
1. Import jars
1. Export jars
