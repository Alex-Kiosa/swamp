export type ChipType = {
    _id: string
    position: {
        x: number
        y: number
    }
    color: string
    shape: "Circle" | "Square" | "Triangle"
}