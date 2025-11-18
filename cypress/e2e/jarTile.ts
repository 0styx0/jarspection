
import { When, Then } from "@badeball/cypress-cucumber-preprocessor";

When("I visit the jars page", () => {
});

When("I color the jar-left as {word}", (color: string) => {
  
})

When("I color the jar-right as {word}", (color: string) => {
  
})

When("I fill the jar-left to {int}%", (fillLevel: number) => {
  
})

When("I fill the jar-right to {int}%", (fillLevel: number) => {
  
})

When("I delete the jar", () => {
  
})

When("I label the jar as {string}", (updatedLabel: string) => {
  
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
// cy.get('button').click({ position: 'topLeft' })
Then('The jar-left color should be {word}', (color: string) => {
  
})

Then('The jar-right color should be {word}', (color: string) => {
  
})

Then('The jar-left fill level should be {int}', (fillLevel: number) => {
  
})

Then('The jar-right fill level should be {int}', (fillLevel: number) => {
  
})

Then('The jar label should be {string}', () => {
  
})

Then('I should see {int} jars on the page', (numJars: number) => {
  
})

