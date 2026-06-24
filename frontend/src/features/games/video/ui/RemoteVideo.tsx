import {type RemoteTrack} from "livekit-client";
import {useEffect, useRef} from "react";
import {PiMicrophoneFill, PiMicrophoneSlashFill, PiVideoCameraFill, PiVideoCameraSlashFill} from "react-icons/pi";

type Props = {
    track: RemoteTrack
    participantName: string
    isCameraEnabled: boolean
    isMicEnabled: boolean
}

export const RemoteVideo = ({
                                track,
                                participantName,
                                isCameraEnabled,
                                isMicEnabled,
                            }: Props) => {
    const videoRef = useRef<HTMLVideoElement>(null)

    useEffect(() => {
        if (!videoRef.current) return

        track.attach(videoRef.current)

        // return выполнится перед размонтированием элемента
        /* track.detach нужен, чтобы не было:
          - утечки памяти;
          - "мертвых" видеоэлементов внутри LiveKit;
          - повторных прикреплений одного и того же трека к нескольким элементам.*/
        return () => {
            track.detach(videoRef.current!)
        }
    }, [track])

    return (
        <div className="relative w-full aspect-video mb-1">
            <video
                ref={videoRef}
                autoPlay
                playsInline
                className="absolute inset-0 h-full w-full object-cover rounded-lg bg-black"
            />

            {!isCameraEnabled && (
                <div className="absolute inset-0 bg-black rounded-lg z-2"/>
            )}

            <div className="absolute bottom-0 left-0 bg-black/60 text-white px-2 py-1 rounded-tr-lg rounded-bl-lg text-sm font-medium z-3">
                {participantName}
            </div>

            <div className="absolute bottom-2 right-2 flex flex-col gap-2">
                <div className="w-8 h-8 rounded-full bg-base-200 text-base-content flex items-center justify-center z-3">
                    {isCameraEnabled
                        ? <PiVideoCameraFill size={16} />
                        : <PiVideoCameraSlashFill size={16} />}
                </div>

                <div className="w-8 h-8 rounded-full bg-base-200 text-base-content flex items-center justify-center z-3">
                    {isMicEnabled
                        ? <PiMicrophoneFill size={16} />
                        : <PiMicrophoneSlashFill size={16} />}
                </div>
            </div>`
        </div>
    )
}