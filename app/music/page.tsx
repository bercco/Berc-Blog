"use client"

import { useState } from "react"
import { MusicNFT } from "@/components/music/music-nft"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Facebook, Twitter, LinkedinIcon, Link2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

// Sample music data
const musicNFTs = [
  {
    id: 1,
    title: "Crypto Beats",
    artist: "SDFM",
    coverImage: "https://i.pinimg.com/736x/92/06/56/920656e03f09691d871e149b5dad8f7f.jpg",
    audioSrc: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    nftLink: "https://sound.xyz",
    description: "A futuristic beat inspired by the world of cryptocurrency and blockchain technology.",
    releaseDate: "2023-04-15",
  },
  {
    id: 2,
    title: "Market Waves",
    artist: "SDFM",
    coverImage: "https://i.pinimg.com/736x/94/d3/14/94d31436dfc73fcf93058089f69ffd96.jpg",
    audioSrc: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    nftLink: "https://sound.xyz",
    description: "An ambient track that captures the ebb and flow of market movements.",
    releaseDate: "2023-05-22",
  },
  {
    id: 3,
    title: "Blockchain Symphony",
    artist: "SDFM",
    coverImage: "https://i.pinimg.com/736x/92/06/56/920656e03f09691d871e149b5dad8f7f.jpg",
    audioSrc: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    nftLink: "https://sound.xyz",
    description: "A complex arrangement representing the interconnected nature of blockchain networks.",
    releaseDate: "2023-06-10",
  },
]

export default function MusicPage() {
  const [selectedNFT, setSelectedNFT] = useState<(typeof musicNFTs)[0] | null>(null)
  const [shareUrl, setShareUrl] = useState("")
  const { toast } = useToast()

  const handleShare = (nft: (typeof musicNFTs)[0]) => {
    setSelectedNFT(nft)
    setShareUrl(`${window.location.origin}/music/${nft.id}`)
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl)
    toast({
      title: "Link copied",
      description: "The link has been copied to your clipboard",
    })
  }

  return (
    <main className="flex min-h-screen flex-col pt-24">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-2">Music NFTs</h1>
          <p className="text-gray-300 mb-8">
            Explore our collection of music NFTs available on Sound.xyz. Each track represents our vision of the future
            of finance and technology.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {musicNFTs.map((nft) => (
              <MusicNFT
                key={nft.id}
                title={nft.title}
                artist={nft.artist}
                coverImage={nft.coverImage}
                audioSrc={nft.audioSrc}
                nftLink={nft.nftLink}
                onShare={() => handleShare(nft)}
              />
            ))}
          </div>

          <div className="mt-12 bg-dark-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-4">About Our Music</h2>
            <p className="text-gray-300 mb-4">
              At SDFM 2520, we believe in the power of music to inspire and connect. Our music NFTs are more than just
              tracks; they're digital assets that represent our brand's vision and values.
            </p>
            <p className="text-gray-300 mb-4">
              Each piece is carefully crafted to evoke the emotions and energy of the financial and technological
              landscapes we operate in. By owning one of our music NFTs, you're not just collecting a piece of art, but
              also supporting our creative journey.
            </p>
            <p className="text-gray-300">
              We release new tracks regularly on Sound.xyz, so check back often for the latest additions to our
              collection.
            </p>
          </div>
        </div>
      </div>

      {/* Share Dialog */}
      <Dialog>
        <DialogTrigger asChild>
          <span className="hidden">Share</span>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share this track</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex items-center gap-4 justify-center">
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(`Check out "${selectedNFT?.title}" by ${selectedNFT?.artist} on SDFM 2520`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-sky-500 text-white rounded-full hover:bg-sky-600 transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-blue-700 text-white rounded-full hover:bg-blue-800 transition-colors"
              >
                <LinkedinIcon className="h-5 w-5" />
              </a>
              <button
                onClick={handleCopyLink}
                className="p-3 bg-dark-600 text-white rounded-full hover:bg-dark-500 transition-colors"
              >
                <Link2 className="h-5 w-5" />
              </button>
            </div>
            <div className="flex items-center">
              <input
                className="flex-1 px-3 py-2 bg-dark-700 border border-dark-600 rounded-l-md text-white"
                value={shareUrl}
                readOnly
              />
              <Button onClick={handleCopyLink} className="rounded-l-none">
                Copy
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  )
}
