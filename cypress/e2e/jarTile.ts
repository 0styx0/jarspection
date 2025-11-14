
import { When, Then } from "@badeball/cypress-cucumber-preprocessor";

When("I visit the jars page", () => {
});

When("I select the color {word}", (color: string) => {
  
})

When("I drag the fill level slider to {int}", (fillLevel: number) => {
  
})

When("I delete the jar", () => {
  
})

When("I update the jar label to {string}", (updatedLabel: string) => {
  
})

When("I add a new jar", () => {
  
})

When("I import the file {word}", (importFileName: string) => {
  
})

When("I export the page", () => {
  
})

//
// does cy support context to avoid specifying the jar in each step???
//
// should I define steps in terms of user actions (eg, click, drag) or in terms of functionality (eg, add, remove)

Then('The right-side jar color should be {word}', (color: string) => {
  
})
Then('The left-side jar color should be {word}', (color: string) => {
  
})

Then('The left-side jar fill level should be {int}', (fillLevel: number) => {
  
})

Then('The right-side jar fill level should be {int}', (fillLevel: number) => {
  
})

Then('The jar label should be {string}', () => {
  
})

Then('I should see {int} jars on the page', (numJars: number) => {
  
})


Then("I should see a search bar", () => {
  cy.get("input[type=text]")
    .should("have.attr", "placeholder")
    .and(
      "match",
      /Search without being tracked|Search privately/,
    );
});
