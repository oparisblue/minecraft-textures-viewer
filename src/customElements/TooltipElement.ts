const TOOLTIP_OFFSET_PX = 10;

export class TooltipElement extends HTMLElement {
  private teardown?: () => void;

  public text?: string;

  constructor() {
    super();
  }

  connectedCallback() {
    const shadow = this.attachShadow({ mode: "open" });

    const text = this.text ?? "";

    const container = document.createElement("div");
    container.addEventListener("mouseenter", (event) => {
      const tooltip = document.createElement("div");
      tooltip.classList.add("tooltip");
      tooltip.innerText = text;
      this.positionTooltip(tooltip, event);

      document.body.append(tooltip);

      const moveListener = (moveEvent: MouseEvent) => {
        this.positionTooltip(tooltip, moveEvent);
      };

      document.body.addEventListener("mousemove", moveListener);

      this.teardown = () => {
        document.body.removeEventListener("mousemove", moveListener);
        tooltip.remove();
      };
    });

    container.addEventListener("mouseleave", () => {
      this.teardown?.();
    });

    const slot = document.createElement("slot");
    container.append(slot);

    shadow.append(container);
  }

  positionTooltip(tooltip: HTMLElement, event: MouseEvent) {
    const { width: w, height: h } = tooltip.getBoundingClientRect();

    const right = tooltipWouldGoOffScreen(window.innerWidth, w, event.clientX);
    const bottom = tooltipWouldGoOffScreen(
      window.innerHeight,
      h,
      event.clientY
    );

    const style = [
      !right && `left: ${event.clientX + TOOLTIP_OFFSET_PX}px;`,
      right &&
        `right: ${window.innerWidth - event.clientX + TOOLTIP_OFFSET_PX}px;`,
      !bottom && `top: ${event.clientY + TOOLTIP_OFFSET_PX}px;`,
      bottom &&
        `bottom: ${window.innerHeight - event.clientY + TOOLTIP_OFFSET_PX}px;`
    ]
      .filter((item) => item)
      .join("");

    tooltip.setAttribute("style", style);
  }

  disconnectedCallback() {
    this.teardown?.();
  }
}

function tooltipWouldGoOffScreen(
  screenSize: number,
  tooltipSize: number,
  mousePosition: number
): boolean {
  const offset = TOOLTIP_OFFSET_PX;
  const paddingBetweenEdgeOfScreen = TOOLTIP_OFFSET_PX;

  return (
    mousePosition >=
    screenSize - tooltipSize - offset - paddingBetweenEdgeOfScreen
  );
}
