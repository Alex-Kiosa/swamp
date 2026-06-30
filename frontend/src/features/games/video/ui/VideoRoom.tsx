import {useEffect, useRef, useState} from "react"
import {RemoteParticipant, RemoteTrack, Room, RoomEvent, Track,} from "livekit-client"
import {getVideoToken} from "../api/videoApi.ts"
import {RemoteVideo} from "./RemoteVideo.tsx"
import {PiMicrophoneFill, PiMicrophoneSlashFill, PiVideoCameraFill, PiVideoCameraSlashFill,} from "react-icons/pi"

type Props = {
    gameId: string
    participantName: string
}

type ParticipantType = {
    id: string
    name: string
    track: RemoteTrack
    isMicEnabled: boolean
    isCameraEnabled: boolean
}

// ==========================================
// VIDEO CHAT BACKLOG (after MVP)
// ==========================================

// TODO: Save camera/microphone state after page refresh.

// TODO: Video grid layout for 6+ participants.

// TODO: Pin host video at the top of the participant list.

// TODO: Show indicator when there are hidden videos below the scroll area.

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

                const videoPublication =
                    participant.getTrackPublication(
                        Track.Source.Camera
                    )

                const audioPublication =
                    participant.getTrackPublication(
                        Track.Source.Microphone
                    )

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

                            isCameraEnabled:
                                !videoPublication?.isMuted,

                            isMicEnabled:
                                !audioPublication?.isMuted,
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

    const scrollRef = useRef<HTMLDivElement>(null)

    const [hasOverflow, setHasOverflow] =
        useState(false)

    useEffect(() => {
        const el = scrollRef.current

        if (!el) return

        const checkOverflow = () => {
            setHasOverflow(
                el.scrollHeight > el.clientHeight
            )
        }

        checkOverflow()

        const resizeObserver =
            new ResizeObserver(checkOverflow)

        resizeObserver.observe(el)

        return () => resizeObserver.disconnect()
    }, [remoteParticipants])

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

                room.remoteParticipants.forEach(addRemoteParticipant)

                try {
                    await room.localParticipant.enableCameraAndMicrophone()

                    setIsCameraEnabled(true)
                    setIsMicEnabled(true)
                } catch (error) {
                    console.error("LIVEKIT CONNECT ERROR", error)

                    // TODO: заменить на показ сообщения в Toast
                    alert(
                        "Не удалось получить доступ к камере или микрофону. Попробуйте закрыть приложения, использующие камеру, или перезапустить браузер."
                    )

                    return
                }

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
                                        isCameraEnabled: true,
                                        isMicEnabled: true,
                                    },
                                ]
                            })
                        }
                    }
                )

                room.on(
                    RoomEvent.TrackMuted,
                    (publication, participant) => {
                        setRemoteParticipants(prev =>
                            prev.map(p => {
                                if (p.id !== participant.sid) {
                                    return p
                                }

                                return {
                                    ...p,
                                    isCameraEnabled:
                                        publication.kind === "video"
                                            ? false
                                            : p.isCameraEnabled,

                                    isMicEnabled:
                                        publication.kind === "audio"
                                            ? false
                                            : p.isMicEnabled,
                                }
                            })
                        )
                    }
                )

                room.on(
                    RoomEvent.TrackUnmuted,
                    (publication, participant) => {
                        setRemoteParticipants(prev =>
                            prev.map(p => {
                                if (p.id !== participant.sid) {
                                    return p
                                }

                                return {
                                    ...p,
                                    isCameraEnabled:
                                        publication.kind === "video"
                                            ? true
                                            : p.isCameraEnabled,

                                    isMicEnabled:
                                        publication.kind === "audio"
                                            ? true
                                            : p.isMicEnabled,
                                }
                            })
                        )
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
        <div className="flex flex-col h-full min-h-0">
            <div className="pr-2 flex-shrink-0">
                <div className="relative w-full aspect-video mb-1">
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="absolute inset-0 h-full w-full object-cover rounded-lg bg-black"
                    />

                    {!isCameraEnabled && (
                        <div className="absolute inset-0 bg-black rounded-lg z-2"/>
                    )}

                    {!isCameraEnabled && <div
                        className="absolute bottom-0 left-0 bg-black/60 text-white px-2 py-1 rounded-tr-lg rounded-bl-lg text-sm font-medium z-3">
                        {participantName}
                    </div>}

                    <div className="absolute bottom-2 right-2 flex flex-col gap-2">
                        <button
                            onClick={toggleCamera}
                            className="btn btn-circle btn-sm  z-3"
                            title={
                                isCameraEnabled
                                    ? "Выключить камеру"
                                    : "Включить камеру"
                            }
                        >
                            {isCameraEnabled
                                ? <PiVideoCameraFill size={16}/>
                                : <PiVideoCameraSlashFill size={16}/>}
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
                                ? <PiMicrophoneFill size={16}/>
                                : <PiMicrophoneSlashFill size={16}/>}
                        </button>
                    </div>
                </div>
            </div>

            <div className="relative flex-1 min-h-0">
                <div
                    ref={scrollRef}
                    className="h-full overflow-y-auto pr-2"
                >
                    {remoteParticipants.map(p => (
                        <RemoteVideo
                            key={p.id}
                            participantName={p.name}
                            track={p.track}
                            isCameraEnabled={p.isCameraEnabled}
                            isMicEnabled={p.isMicEnabled}
                        />
                    ))}
                </div>

                {hasOverflow && (
                    <div className="absolute bottom-0 left-0 right-2 h-10 pointer-events-none bg-gradient-to-t from-base-100 to-transparent" />
                )}
            </div>
        </div>
    )
}