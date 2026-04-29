import { JitsiMeeting } from "@jitsi/react-sdk"

type Props = {
    gameId: string
    playerName: string
}

export const VideoRoom = ({ gameId, playerName }: Props) => {
    return (
        <div
            className="
        fixed
        bottom-4
        right-4
        w-[320px]
        h-[240px]
        z-[9999]
        rounded-lg
        overflow-hidden
        shadow-lg
        border
      "
        >
            <JitsiMeeting
                domain="meet.jit.si"
                roomName={`swamp-${gameId}`}
                userInfo={{
                    displayName: playerName
                }}
                configOverwrite={{
                    prejoinPageEnabled: false,
                    startWithAudioMuted: false,
                    startWithVideoMuted: false,
                    disableSelfView: false
                }}
                interfaceConfigOverwrite={{
                    DISABLE_JOIN_LEAVE_NOTIFICATIONS: true
                }}
            />
        </div>
    )
}