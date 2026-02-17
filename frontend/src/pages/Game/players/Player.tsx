type Props = {
    name: string
}

export const Player= ({name}: Props) => {
    return <span className="badge badge-neutral">{name}</span>
}