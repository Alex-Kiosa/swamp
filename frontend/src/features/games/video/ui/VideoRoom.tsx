import { useEffect, useRef, useState } from "react"
import {
    RemoteParticipant,
    RemoteTrack,
    Room,
    RoomEvent,
} from "livekit-client"
import { getVideoToken } from "../api/videoApi.ts"
import { RemoteVideo } from "./RemoteVideo.tsx"

type Props = {
    gameId: string
    participantName: string
}

type ParticipantType = {
    id: string
    name: string
    track: RemoteTrack
}

export const VideoRoom = ({
                              gameId,
                              participantName,
                          }: Props) => {
    const videoRef = useRef<HTMLVideoElement>(null)
    const roomRef = useRef<Room | null>(null)

    const [remoteParticipants, setRemoteParticipants] =
        useState<ParticipantType[]>([])

    const addRemoteParticipant = (
        participant: RemoteParticipant
    ) => {
        participant.trackPublications.forEach(
            publication => {
                const track = publication.track

                if (
                    !track ||
                    track.kind !== "video"
                ) {
                    return
                }

                setRemoteParticipants(prev => {
                    const exists = prev.some(
                        p => p.id === participant.sid
                    )

                    if (exists) return prev

                    return [
                        ...prev,
                        {
                            id: participant.sid,
                            name: participant.identity,
                            track,
                        },
                    ]
                })
            }
        )
    }

    useEffect(() => {
        const connect = async () => {
            try {
                const token = await getVideoToken(
                    gameId,
                    participantName
                )

                const room = new Room()
                roomRef.current = room

                await room.connect(
                    import.meta.env.VITE_LIVEKIT_URL!,
                    token
                )

                // участники, которые уже были в комнате
                room.remoteParticipants.forEach(
                    addRemoteParticipant
                )

                await room.localParticipant.enableCameraAndMicrophone()

                for (const publication of room.localParticipant.videoTrackPublications.values()) {
                    const track = publication.videoTrack

                    if (
                        track &&
                        videoRef.current
                    ) {
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

                room.on(
                    RoomEvent.TrackSubscribed,
                    (track, _, participant) => {
                        if (track.kind !== "video") return

                        setRemoteParticipants(prev => {
                            const exists = prev.some(
                                p => p.id === participant.sid
                            )

                            if (exists) return prev

                            return [
                                ...prev,
                                {
                                    id: participant.sid,
                                    name: participant.identity,
                                    track,
                                },
                            ]
                        })
                    }
                )

                room.on(
                    RoomEvent.ParticipantDisconnected,
                    participant => {
                        setRemoteParticipants(prev =>
                            prev.filter(
                                p =>
                                    p.id !==
                                    participant.sid
                            )
                        )
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
            roomRef.current?.disconnect()
            roomRef.current = null
            setRemoteParticipants([])
        }
    }, [gameId, participantName])

    return (
        <>
            <div className="relative w-full">
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full rounded-lg"
                />

                <div className="absolute bottom-3 left-3 bg-black/60 text-white px-3 py-1.5 rounded-lg text-sm font-medium backdrop-blur-sm">
                    {participantName}
                </div>
            </div>

            {remoteParticipants.map(p => (
                <RemoteVideo
                    key={p.id}
                    participantName={p.name}
                    track={p.track}
                />
            ))}
        </>
    )
}