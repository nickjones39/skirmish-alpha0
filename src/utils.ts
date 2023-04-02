export function convertPositionStringToCoords(
  position: string
): { x: number; y: number } {
  return {
    x: parseInt(position.substring(0, position.indexOf(",")), 10),
    y: parseInt(
      position.substring(position.indexOf(",") + 1, position.length),
      10
    )
  };
}
