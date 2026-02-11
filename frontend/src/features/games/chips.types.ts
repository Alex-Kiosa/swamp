export type ChipDomainType = {
    _id: string
    position: {
        x: number
        y: number
    }
    color: string
    shape: "Circle" | "Square" | "Triangle"
}

export type ChipType = ChipDomainType & {
    isLocked: boolean
}