import type {ChipType} from "../../../features/games/chips.types.ts";

type Props = {
    chip: ChipType
}

export const Chip = ({chip}: Props) => {
    const {position, color, shape} = chip

    return (
        <div
            style={{
                position: "absolute",
                left: position.x,
                top: position.y,
                width: 30,
                height: 30,
                backgroundColor: color,
                borderRadius: shape === "Circle" ? "50%" : "4px",
                clipPath:
                    shape === "Triangle"
                        ? "polygon(50% 0%, 0% 100%, 100% 100%)"
                        : "none",
            }}
        />
    )
}