"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Mic, MicOff, Video, VideoOff, PhoneOff } from "lucide-react"

interface HMSVideoCallProps {
  roomId?: string
  username: string
  onJoinRoom?: () => void
  onLeaveRoom?: () => void
}

export function HMSVideoCall({ roomId, username, onJoinRoom, onLeaveRoom }: HMSVideoCallProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isJoined, setIsJoined] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Initialize camera
  useEffect(() => {
    if (!videoRef.current) return

    const initCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      } catch (err) {
        console.error("Error accessing camera:", err)
        setError("Could not access camera or microphone")
      }
    }

    initCamera()

    return () => {
      // Clean up video stream
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  // Toggle mute
  const toggleMute = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      const audioTracks = stream.getAudioTracks()
      audioTracks.forEach((track) => {
        track.enabled = isMuted
      })
      setIsMuted(!isMuted)
    }
  }

  // Toggle video
  const toggleVideo = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      const videoTracks = stream.getVideoTracks()
      videoTracks.forEach((track) => {
        track.enabled = isVideoOff
      })
      setIsVideoOff(!isVideoOff)
    }
  }

  // Join 100ms room
  const joinRoom = async () => {
    setIsLoading(true)

    try {
      // This is where you would integrate with 100ms SDK
      // For now, we'll just simulate joining a room
      console.log("Joining 100ms room:", roomId || "default-room")
      console.log("Using template ID:", process.env.NEXT_PUBLIC_100MS_TEMPLATE_ID)

      // Simulate successful join
      setTimeout(() => {
        setIsJoined(true)
        setIsLoading(false)
        if (onJoinRoom) onJoinRoom()
      }, 1500)
    } catch (err) {
      console.error("Error joining 100ms room:", err)
      setError("Failed to join video call room")
      setIsLoading(false)
    }
  }

  // Leave 100ms room
  const leaveRoom = () => {
    setIsLoading(true)

    try {
      // This is where you would disconnect from 100ms SDK
      console.log("Leaving 100ms room")

      // Simulate successful leave
      setTimeout(() => {
        setIsJoined(false)
        setIsLoading(false)
        if (onLeaveRoom) onLeaveRoom()
      }, 500)
    } catch (err) {
      console.error("Error leaving 100ms room:", err)
      setIsLoading(false)
    }
  }

  return (
    <div className="flex h-full w-full flex-col bg-gray-900">
      <div className="relative flex-1">
        {/* Local video */}
        <div className="h-full w-full bg-black">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`h-full w-full object-cover ${isVideoOff ? "opacity-0" : "opacity-100"}`}
          />
        </div>

        {/* Video off overlay */}
        {isVideoOff && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-800 text-3xl font-bold text-white">
              {username.charAt(0).toUpperCase()}
            </div>
          </div>
        )}

        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70">
            <div className="flex flex-col items-center">
              <div className="mb-4 h-10 w-10 animate-spin rounded-full border-4 border-yellow-500 border-t-transparent"></div>
              <p className="text-white">{isJoined ? "Leaving call..." : "Joining call..."}</p>
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70">
            <div className="max-w-md rounded-lg bg-red-900/80 p-4 text-center">
              <p className="mb-2 text-white">{error}</p>
              <Button
                variant="outline"
                onClick={() => setError(null)}
                className="border-white text-white hover:bg-red-800"
              >
                Dismiss
              </Button>
            </div>
          </div>
        )}

        {/* Controls overlay */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center">
          <div className="flex items-center gap-4 rounded-full bg-gray-800/80 px-6 py-3 backdrop-blur-sm">
            <button
              onClick={toggleMute}
              className={`flex h-12 w-12 items-center justify-center rounded-full ${
                isMuted ? "bg-red-500" : "bg-gray-700"
              }`}
            >
              {isMuted ? <MicOff className="h-6 w-6 text-white" /> : <Mic className="h-6 w-6 text-white" />}
            </button>

            {isJoined ? (
              <button
                onClick={leaveRoom}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-red-600 hover:bg-red-700"
              >
                <PhoneOff className="h-7 w-7 text-white" />
              </button>
            ) : (
              <button
                onClick={joinRoom}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-green-600 hover:bg-green-700"
              >
                <Video className="h-7 w-7 text-white" />
              </button>
            )}

            <button
              onClick={toggleVideo}
              className={`flex h-12 w-12 items-center justify-center rounded-full ${
                isVideoOff ? "bg-red-500" : "bg-gray-700"
              }`}
            >
              {isVideoOff ? <VideoOff className="h-6 w-6 text-white" /> : <Video className="h-6 w-6 text-white" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
