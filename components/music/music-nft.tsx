"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, ExternalLink, Share2 } from "lucide-react"
import Image from "next/image"

interface MusicNFTProps {
  title: string
  artist: string
  coverImage: string
  audioSrc: string
  nftLink?: string
  onShare?: () => void
}

export function MusicNFT({ title, artist, coverImage, audioSrc, nftLink, onShare }: MusicNFTProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [isMuted, setIsMuted] = useState(false)

  const audioRef = useRef<HTMLAudioElement>(null)
  const progressBarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const setAudioData = () => {
      setDuration(audio.duration)
    }

    const setAudioTime = () => {
      setCurrentTime(audio.currentTime)
    }

    // Events
    audio.addEventListener("loadeddata", setAudioData)
    audio.addEventListener("timeupdate", setAudioTime)
    audio.addEventListener("ended", () => setIsPlaying(false))

    // Cleanup
    return () => {
      audio.removeEventListener("loadeddata", setAudioData)
      audio.removeEventListener("timeupdate", setAudioTime)
      audio.removeEventListener("ended", () => setIsPlaying(false))
    }
  }, [])

  // Handle play/pause
  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }

    setIsPlaying(!isPlaying)
  }

  // Handle volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseFloat(e.target.value)
    setVolume(value)

    if (audioRef.current) {
      audioRef.current.volume = value
      setIsMuted(value === 0)
    }
  }

  // Handle mute toggle
  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume
        setIsMuted(false)
      } else {
        audioRef.current.volume = 0
        setIsMuted(true)
      }
    }
  }

  // Handle progress bar click
  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const progressBar = progressBarRef.current
    if (!progressBar || !audioRef.current) return

    const rect = progressBar.getBoundingClientRect()
    const percent = (e.clientX - rect.left) / rect.width
    const newTime = percent * duration

    audioRef.current.currentTime = newTime
    setCurrentTime(newTime)
  }

  // Format time (seconds to MM:SS)
  const formatTime = (time: number) => {
    if (isNaN(time)) return "00:00"

    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)

    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  return (
    <div className="bg-dark-800 rounded-lg overflow-hidden">
      <div className="relative aspect-square">
        <Image src={coverImage || "/placeholder.svg"} alt={`${title} by ${artist}`} fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-dark-900/80"></div>

        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-xl font-bold text-white mb-1">{title}</h3>
          <p className="text-gray-300">{artist}</p>
        </div>
      </div>

      <div className="p-4">
        <audio ref={audioRef} src={audioSrc} preload="metadata" />

        {/* Progress bar */}
        <div
          ref={progressBarRef}
          className="h-1 bg-dark-600 rounded-full mb-2 cursor-pointer"
          onClick={handleProgressBarClick}
        >
          <div className="h-full bg-white rounded-full" style={{ width: `${(currentTime / duration) * 100}%` }}></div>
        </div>

        <div className="flex justify-between text-xs text-gray-400 mb-4">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
              <SkipBack className="h-5 w-5" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-full bg-white text-dark-900 hover:bg-gray-200 hover:text-dark-900"
              onClick={togglePlay}
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>

            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
              <SkipForward className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white" onClick={toggleMute}>
              {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </Button>

            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-20 h-1 bg-dark-600 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
            />
          </div>
        </div>

        {/* NFT Link */}
        <div className="flex justify-between mt-4 pt-4 border-t border-dark-600">
          {nftLink ? (
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white" asChild>
              <a href={nftLink} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                View on Sound.xyz
              </a>
            </Button>
          ) : (
            <div></div>
          )}

          {onShare && (
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white" onClick={onShare}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
