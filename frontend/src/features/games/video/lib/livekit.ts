import { Room } from "livekit-client"
import { getVideoToken } from "../api/videoApi"

export const connectToVideoRoom = async (
    gameId: string,
    participantName: string
) => {
    const room = new Room()

    room.on("connected", () => {
        console.log("LiveKit connected")
    })

    room.on("participantConnected", participant => {
        console.log(
            "Participant connected:",
            participant.identity
        )
    })

    room.on("participantDisconnected", participant => {
        console.log(
            "Participant disconnected:",
            participant.identity
        )
    })

    const token = await getVideoToken(
        gameId,
        participantName
    )

    await room.connect(
        import.meta.env.VITE_LIVEKIT_URL,
        token
    )

    await room.localParticipant.enableCameraAndMicrophone()

    return room
}