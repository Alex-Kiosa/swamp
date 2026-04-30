import { JitsiMeeting } from "@jitsi/react-sdk"

type Props = {
    gameId: string
}

export const VideoRoom = ({ gameId}: Props) => {
    return (
        <div
            className="
        fixed
        inset-0
        z-[9999]
        bg-black
        z-[9999]
        rounded-lg
        shadow-lg
        border
      "
        >
            <JitsiMeeting
                domain="meet.jit.si"
                roomName={`swamp-${gameId}-${Date.now()}`}
                configOverwrite={{
                    prejoinPageEnabled: false,
                    disableSelfView: false,
                    startWithAudioMuted: true,
                    startWithVideoMuted: true,
                    enableUserRolesBasedOnToken: false,
                    requireDisplayName: false
                }}
                interfaceConfigOverwrite={{
                    DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
                    SHOW_JITSI_WATERMARK: false,
                    DEFAULT_REMOTE_DISPLAY_NAME: "Игрок",
                    DEFAULT_LOCAL_DISPLAY_NAME: "Игрок"
                }}
                getIFrameRef={(iframe) => {
                    iframe.style.width = "100%"
                    iframe.style.height = "100%"
                    iframe.style.border = "0"
                }}
            />
        </div>
    )
}