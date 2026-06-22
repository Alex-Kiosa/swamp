import {type RemoteTrack} from "livekit-client";
import {useEffect, useRef} from "react";

type Props = {
    track: RemoteTrack
    participantName: string
}

export const RemoteVideo = ({
                                track,
                                participantName,
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
        <div className="relative w-full">
            <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full rounded-lg"
            />

            <div className="absolute bottom-3 left-3 bg-black/60 text-white px-3 py-1.5 rounded-lg text-sm">
                {participantName}
            </div>
        </div>
    )
}