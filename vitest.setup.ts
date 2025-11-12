import { beforeAll, beforeEach } from "vitest";

beforeEach(() => {
  document.body.innerHTML = "";
});

beforeAll(() => {
  if (!Blob.prototype.text) {
    Blob.prototype.text = function () {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsText(this);
      });
    };
  }
});
