import { act, fireEvent, render, screen } from "@testing-library/react";
import LetterC from "./letter-c";

test("mind-map connectors follow card edges when entering fullscreen and resizing", () => {
  let wide = false;
  let onResize;
  const rect = (left, top, width, height) => ({ left, top, width, height, right: left + width, bottom: top + height });
  const geometry = (element) => {
    if (element.classList.contains("clarity-map-canvas")) return rect(0, 0, wide ? 1000 : 700, 400);
    if (element.classList.contains("clarity-center-node")) return rect(wide ? 410 : 270, 160, wide ? 180 : 160, 80);
    if (element.classList.contains("clarity-thought-card")) {
      const index = Array.from(element.parentElement.children).indexOf(element);
      return rect(index % 2 ? (wide ? 700 : 500) : 0, index < 2 ? 20 : 260, wide ? 300 : 200, 120);
    }
    return rect(0, 0, 0, 0);
  };
  const originalObserver = window.ResizeObserver;
  window.ResizeObserver = class {
    constructor(callback) { onResize = callback; }
    observe() {}
    disconnect() {}
  };
  jest.useFakeTimers();
  jest.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function () { return geometry(this); });
  jest.spyOn(HTMLElement.prototype, "clientWidth", "get").mockImplementation(function () { return geometry(this).width; });
  jest.spyOn(HTMLElement.prototype, "clientHeight", "get").mockImplementation(function () { return geometry(this).height; });
  jest.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue();
  jest.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});

  const { container, unmount } = render(<LetterC onBack={() => {}} />);
  try {
    fireEvent.click(screen.getByRole("button", { name: "Plan this reflection" }));
    act(() => jest.advanceTimersByTime(50));
    const paths = () => Array.from(container.querySelectorAll(".clarity-map-connectors path"));
    expect(paths()).toHaveLength(4);
    expect(paths()[0].getAttribute("d")).toMatch(/, 200 80$/);
    expect(paths()[1].getAttribute("d")).toMatch(/, 500 80$/);

    wide = true;
    act(() => {
      document.dispatchEvent(new Event("fullscreenchange"));
      onResize();
      jest.advanceTimersByTime(50);
    });
    expect(paths()[0].getAttribute("d")).toMatch(/, 300 80$/);
    expect(paths()[1].getAttribute("d")).toMatch(/, 700 80$/);
    expect(paths()[2].getAttribute("d")).toMatch(/, 300 320$/);
    expect(paths()[3].getAttribute("d")).toMatch(/, 700 320$/);
    expect(container.querySelector(".clarity-map-connectors")).toHaveAttribute("viewBox", "0 0 1000 400");
  } finally {
    unmount();
    jest.restoreAllMocks();
    jest.useRealTimers();
    window.ResizeObserver = originalObserver;
  }
});
