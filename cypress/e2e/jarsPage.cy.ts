describe("template spec", () => {
  // describe("initial page load", () => {
  //   it("should display default jars", () => {});
  // });

  // describe.skip("reloading the page", () => {
  //   it("should preserve jars edited based on the default jars", () => {});

  //   it("should preserve jars edited based on importing from file", () => {});
  // });

  // describe("jar tile", () => {
  //   describe("jar color", () => {
  //     it("should match the initially selected color option", () => {});

  //     it("should change when selecting a new color", () => {});

  //     it("changing left half should leave the right half untouched", () => {});

  //     it("changing right half should leave the left half untouched", () => {});
  //   });

  //   describe("jar fill level", () => {
  //     it("should match the initially selected fill option", () => {});

  //     it("should change when move the range slider", () => {});

  //     it("changing left half should leave the right half untouched", () => {});

  //     it("changing right half should leave the left half untouched", () => {});
  //   });

  //   describe("label", () => {
  //     it("should be editable", () => {});
  //   });

  //   describe("deletion", () => {
  //     it("should remove jar from the page", () => {});
  //   });
  // });

  // describe("adding jar", () => {
  //   it("should add as the last jar in the list", () => {});
  // });

  // describe("page controls", () => {
  //   describe("importing", () => {
  //     it("warns the user if the import would remove existing jars", () => {});

  //     it("replaces all jars on the page with those from the imported file", () => {});
  //   });

  //   describe("exporting", () => {
  //     it("generates a file containing all jars", () => {});
  //   });

  //   describe("exporting and exporting", () => {
  //     it("should leave the page in the original state", () => {});
  //   });
  // });

  it("passes", () => {
    cy.visit("http://localhost:5173/");
  });
});

it('studio test', function() {
  cy.visit('http://localhost:5173/')
  
});
