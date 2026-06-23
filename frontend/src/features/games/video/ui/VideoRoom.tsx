import { useEffect, useRef, useState } from "react"
import {
    RemoteParticipant,
    RemoteTrack,
    Room,
    RoomEvent,
} from "livekit-client"
import { getVideoToken } from "../api/videoApi.ts"
import { RemoteVideo } from "./RemoteVideo.tsx"
import {
    PiMicrophoneFill,
    PiMicrophoneSlashFill,
    PiVideoCameraFill,
    PiVideoCameraSlashFill,
} from "react-icons/pi"

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

    const [isMicEnabled, setIsMicEnabled] =
        useState(false)

    const [isCameraEnabled, setIsCameraEnabled] =
        useState(false)

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

    const toggleMicrophone = async () => {
        const room = roomRef.current

        if (!room) return

        const nextState = !isMicEnabled

        await room.localParticipant.setMicrophoneEnabled(
            nextState
        )

        setIsMicEnabled(nextState)
    }

    const toggleCamera = async () => {
        const room = roomRef.current

        if (!room) return

        const nextState = !isCameraEnabled

        await room.localParticipant.setCameraEnabled(
            nextState
        )

        setIsCameraEnabled(nextState)
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

                room.remoteParticipants.forEach(
                    addRemoteParticipant
                )

                await room.localParticipant.enableCameraAndMicrophone()

                setIsCameraEnabled(true)
                setIsMicEnabled(true)

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

                        console.log(
                            "track subscribed",
                            track.kind,
                            participant.identity
                        )

                        if (track.kind === "audio") {
                            track.attach()
                            return
                        }

                        if (track.kind === "video") {
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
            <div className="relative w-full aspect-video mb-6">
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="absolute inset-0 h-full w-full object-cover rounded-lg bg-black"
                />

                {!isCameraEnabled && (
                    <div className="absolute inset-0 bg-black rounded-lg z-2" />
                )}

                <div className="absolute bottom-3 left-3 bg-black/60 text-white px-3 py-1.5 rounded-lg text-sm font-medium z-3">
                    {participantName}
                </div>

                <div className="absolute bottom-2 right-2 flex flex-col gap-2">
                    <button
                        onClick={toggleCamera}
                        className="btn btn-circle btn-sm z-3"
                        title={
                            isCameraEnabled
                                ? "Выключить камеру"
                                : "Включить камеру"
                        }
                    >
                        {isCameraEnabled
                            ? <PiVideoCameraFill />
                            : <PiVideoCameraSlashFill />}
                    </button>

                    <button
                        onClick={toggleMicrophone}
                        className="btn btn-circle btn-sm z-3"
                        title={
                            isMicEnabled
                                ? "Выключить микрофон"
                                : "Включить микрофон"
                        }
                    >
                        {isMicEnabled
                            ? <PiMicrophoneFill />
                            : <PiMicrophoneSlashFill />}
                    </button>
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