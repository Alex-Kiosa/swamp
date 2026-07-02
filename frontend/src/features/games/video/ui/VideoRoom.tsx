import {useEffect, useRef, useState} from "react"
import {
    LocalTrackPublication,
    Participant,
    RemoteParticipant,
    RemoteTrack,
    RemoteTrackPublication,
    Room,
    RoomEvent,
    TrackPublication,
} from "livekit-client"
import {getVideoToken} from "../api/videoApi.ts"
import {RemoteVideo} from "./RemoteVideo.tsx"
import {PiMicrophoneFill, PiMicrophoneSlashFill, PiVideoCameraFill, PiVideoCameraSlashFill,} from "react-icons/pi"

type Props = {
    gameId: string
    participantName: string
}

type ParticipantType = {
    sid: string
    playerId: string
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

    const handleLocalTrackPublished = (publication: LocalTrackPublication) => {
        const track = publication.track

        if (
            track?.kind === "video" &&
            videoRef.current
        ) {
            track.attach(videoRef.current)
        }
    }

    // Debug handlers. Keep for LiveKit diagnostics.
    // const handleParticipantConnected = (participant: RemoteParticipant) => {
    //     console.log("PARTICIPANT CONNECTED", participant.name)
    // }
    //
    // const handleTrackPublished = (publication: RemoteTrackPublication, participant: RemoteParticipant) => {
    //     console.log("TRACK PUBLISHED", participant.name, publication.kind)
    // }

    const handleTrackSubscribed = (
        track: RemoteTrack,
        _: RemoteTrackPublication,
        participant: RemoteParticipant
    ) => {
        // console.log("TRACK SUBSCRIBED", participant.name, track.kind)

        if (track.kind === "audio") {
            const audio = track.attach()

            document.body.appendChild(audio)

            audio.play().catch(() => {
                // Автовоспроизведение может быть заблокировано браузером.
            })

            return
        }

        setRemoteParticipants(prev => {
            // Проверяем наличие участника, чтобы не добавить его дважды.
            if (prev.some(p => p.sid === participant.sid)) {
                return prev
            }

            return [
                ...prev,
                {
                    sid: participant.sid,
                    playerId: participant.identity,
                    name: participant.name ?? participant.identity,
                    track,
                    isCameraEnabled: true,
                    isMicEnabled: true,
                },
            ]
        })
    }

    const handleTrackMuted = (
        publication: TrackPublication,
        participant: Participant
    ) => {
        setRemoteParticipants(prev =>
            prev.map(p => {
                if (p.sid !== participant.sid) {
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

    const handleTrackUnmuted = (
        publication: TrackPublication,
        participant: Participant
    ) => {
        setRemoteParticipants(prev =>
            prev.map(p => {
                if (p.sid !== participant.sid) {
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

    const handleParticipantDisconnected = (
        participant: RemoteParticipant
    ) => {
        setRemoteParticipants(prev =>
            prev.filter(
                p => p.sid !== participant.sid
            )
        )
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

                // Important! Register handlers before room.connect()
                room.on(RoomEvent.LocalTrackPublished, handleLocalTrackPublished)
                // Debug handlers. Keep for LiveKit diagnostics.
                // room.on(RoomEvent.ParticipantConnected, handleParticipantConnected)
                // room.on(RoomEvent.TrackPublished, handleTrackPublished)
                room.on(RoomEvent.TrackSubscribed, handleTrackSubscribed)
                room.on(RoomEvent.TrackMuted, handleTrackMuted)
                room.on(RoomEvent.TrackUnmuted, handleTrackUnmuted)
                room.on(RoomEvent.ParticipantDisconnected, handleParticipantDisconnected)

                await room.connect(
                    import.meta.env.VITE_LIVEKIT_URL!,
                    token
                )


                try {
                    await room.localParticipant.enableCameraAndMicrophone()

                    setIsCameraEnabled(true)
                    setIsMicEnabled(true)
                } catch (error) {
                    console.error("Failed to enable camera and microphone", error)

                    // TODO: заменить на показ сообщения в Toast
                    alert(
                        "Не удалось получить доступ к камере или микрофону. Попробуйте закрыть приложения, использующие камеру, или перезапустить браузер."
                    )

                    return
                }
            } catch (error) {
                console.error("LIVEKIT CONNECT ERROR", error)
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
                            key={p.sid}
                            participantId={p.playerId}
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