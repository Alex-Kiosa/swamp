import { useEffect, useRef } from "react"
import { Room, RoomEvent } from "livekit-client"
import { getVideoToken } from "../api/videoApi.ts"

type Props = {
    gameId: string
    participantName: string
}

export const VideoRoom = ({
                              gameId,
                              participantName,
                          }: Props) => {
    const videoRef = useRef<HTMLVideoElement>(null)

    useEffect(() => {
        let room: Room | null = null

        const connect = async () => {
            try {
                const token = await getVideoToken(
                    gameId,
                    participantName
                )

                room = new Room()

                await room.connect(
                    import.meta.env.VITE_LIVEKIT_URL!,
                    token
                )

                await room.localParticipant.enableCameraAndMicrophone()

                for (const publication of room.localParticipant.videoTrackPublications.values()) {
                    const track = publication.videoTrack

                    if (track && videoRef.current) {
                        track.attach(videoRef.current)
                    }
                }

                room.on(
                    RoomEvent.LocalTrackPublished,
                    publication => {
                        const track = publication.track

                        if (
                            track?.kind === "video" &&
                            videoRef.current
                        ) {
                            track.attach(videoRef.current)
                        }
                    }
                )
            } catch (error) {
                console.error(
                    "LIVEKIT CONNECT ERROR",
                    error
                )
            }
        }

        connect()

        return () => {
            room?.disconnect()
        }
    }, [gameId, participantName])

    return (
        <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full rounded-lg"
        />
    )
}