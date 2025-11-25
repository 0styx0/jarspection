import { beforeAll, beforeEach, vi , vitest } from "vitest";

beforeEach(() => {
      vitest.clearAllMocks()
  document.body.innerHTML = "";
});

beforeAll(() => {
  // fixes TypeError: The "obj" argument must be an instance of Blob. Received an instance of Blob
  //  when testing or including JarExporter into other tests
  // https://github.com/vitest-dev/vitest/issues/3985#issuecomment-1695910320
  vi.spyOn(window.URL, "createObjectURL").mockImplementation(
    () => "http://fake.vitestsetup",
  );

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
