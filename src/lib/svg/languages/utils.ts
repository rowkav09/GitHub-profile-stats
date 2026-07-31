//Helper function to conver the layout key (snake_case) into Title case.
export function formatLayoutLabel(layout: string): string {
  return layout
    .split("_")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}
