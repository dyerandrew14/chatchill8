"use client"

import { useEffect, useRef, useState } from "react"
import { Mic, MicOff, Video, VideoOff } from "lucide-react"
import Image from "next/image"

interface CameraViewProps {
  isLocal: boolean
  username: string
  countryFlag: string
  isActive: boolean
  profileImage?: string
  videoTrack?: any
  audioTrack?: any
  onProfileClick?: () => void
}

export function CameraView({
  isLocal,
  username,
  countryFlag,
  isActive,
  profileImage,
  videoTrack,
  audioTrack,
  onProfileClick,
}: CameraViewProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [hasPermission, setHasPermission] = useState(true)

  // Initialize camera when component mounts
  useEffect(() => {
    if (!isLocal || !isActive) return

    let stream: MediaStream | null = null

    const initCamera = async () => {
      try {
        // Request camera and microphone permissions
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        })

        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.onloadedmetadata = () => {
            setIsLoading(false)
          }
        }

        setHasPermission(true)
      } catch (error) {
        console.error("Error accessing camera:", error)
        setHasPermission(false)
        setIsLoading(false)
      }
    }

    initCamera()

    // Clean up
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [isLocal, isActive])

  // Handle Agora video track if provided
  useEffect(() => {
    if (!isLocal && videoTrack && isActive && containerRef.current) {
      try {
        videoTrack.play(containerRef.current)
        setIsLoading(false)
      } catch (error) {
        console.error("Error playing remote video track:", error)
        setIsLoading(false)
      }

      return () => {
        try {
          videoTrack.stop()
        } catch (error) {
          console.error("Error stopping remote video track:", error)
        }
      }
    }
  }, [videoTrack, isLocal, isActive])

  // Toggle mute state
  const toggleMute = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const audioTracks = (videoRef.current.srcObject as MediaStream).getAudioTracks()
      audioTracks.forEach((track) => {
        track.enabled = isMuted
      })
      setIsMuted(!isMuted)
    } else if (audioTrack) {
      audioTrack.setEnabled(!isMuted)
      setIsMuted(!isMuted)
    }
  }

  // Toggle video state
  const toggleVideo = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const videoTracks = (videoRef.current.srcObject as MediaStream).getVideoTracks()
      videoTracks.forEach((track) => {
        track.enabled = isVideoOff
      })
      setIsVideoOff(!isVideoOff)
    } else if (videoTrack) {
      videoTrack.setEnabled(!isVideoOff)
      setIsVideoOff(!isVideoOff)
    }
  }

  return (
    <div className="relative h-full w-full overflow-hidden bg-gray-900">
      {/* Video container */}
      <div ref={containerRef} className="h-full w-full bg-gray-800 relative">
        {isLocal && (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`h-full w-full object-cover ${isVideoOff ? "hidden" : ""}`}
          />
        )}
      </div>

      {/* Loading overlay */}
      {isLoading && isActive && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
        </div>
      )}

      {/* Permission denied overlay */}
      {!hasPermission && isLocal && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 p-4">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500">
            <Video className="h-8 w-8 text-white" />
          </div>
          <h3 className="mb-2 text-xl font-bold text-white">Camera Access Denied</h3>
          <p className="mb-4 text-center text-gray-300">
            Please allow camera access in your browser settings to use video chat.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="rounded bg-yellow-500 px-4 py-2 text-black hover:bg-yellow-600"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Inactive overlay */}
      {(!isActive || isVideoOff) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900">
          {profileImage ? (
            <Image
              src={profileImage || "/placeholder.svg"}
              alt={username}
              width={120}
              height={120}
              className="mb-4 rounded-full"
            />
          ) : (
            <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gray-700 text-3xl font-bold text-white">
              {username.charAt(0).toUpperCase()}
            </div>
          )}
          <p className="text-lg font-medium text-white">{username}</p>
          <p className="mt-2 text-sm text-gray-400">Camera {isVideoOff ? "off" : "inactive"}</p>
        </div>
      )}

      {/* User info overlay */}
      {isActive && (
        <div
          className={`absolute bottom-4 left-4 flex items-center gap-2 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full ${
            onProfileClick ? "cursor-pointer hover:bg-black/70" : ""
          }`}
          onClick={onProfileClick}
        >
          <span className="text-xl">{countryFlag}</span>
          <span className="font-medium">{username}</span>
        </div>
      )}

      {/* Controls - Moved lower on the screen */}
      {isLocal && isActive && (
        <div className="absolute bottom-4 right-4 flex flex-col gap-2">
          <button
            onClick={toggleMute}
            className={`flex h-10 w-10 items-center justify-center rounded-full ${
              isMuted ? "bg-red-500" : "bg-gray-700"
            }`}
          >
            {isMuted ? <MicOff className="h-5 w-5 text-white" /> : <Mic className="h-5 w-5 text-white" />}
          </button>
          <button
            onClick={toggleVideo}
            className={`flex h-10 w-10 items-center justify-center rounded-full ${
              isVideoOff ? "bg-red-500" : "bg-gray-700"
            }`}
          >
            {isVideoOff ? <VideoOff className="h-5 w-5 text-white" /> : <Video className="h-5 w-5 text-white" />}
          </button>
        </div>
      )}
    </div>
  )
}
