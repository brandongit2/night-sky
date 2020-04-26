export function box(xSize: number, ySize: number, zSize: number): number[] {
    // Halve the dimension values so that we can place the box at the origin
    let x = xSize / 2;
    let y = ySize / 2;
    let z = zSize / 2;

    return [
        -x, -y, -z
    ];
}
