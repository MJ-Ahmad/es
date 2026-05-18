// Audio utilities for playing pronunciation audio

/**
 * Plays audio from a file path
 * @param filePath Path to the audio file
 * @returns Promise that resolves when audio playback ends or rejects on error
 */
export function playAudioFile(filePath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      const audio = new Audio(filePath)

      audio.onended = () => {
        resolve()
      }

      audio.onerror = (error) => {
        console.error("Audio playback error:", error)
        reject(error)
      }

      // Start playback
      audio.play().catch((error) => {
        console.error("Audio play error:", error)
        reject(error)
      })
    } catch (error) {
      console.error("Audio creation error:", error)
      reject(error)
    }
  })
}

/**
 * Plays pronunciation for a word using pre-recorded audio files
 * @param word The word to pronounce
 * @returns Promise that resolves when audio playback ends
 */
export async function playWordPronunciation(word: string): Promise<void> {
  const normalizedWord = word.toLowerCase().trim()
  const filePath = `/audio/words/${normalizedWord}.mp3`

  try {
    await playAudioFile(filePath)
    return Promise.resolve()
  } catch (error) {
    console.error(`Error playing word pronunciation for "${word}":`, error)
    return fallbackAudio(word)
  }
}

/**
 * Plays pronunciation for a sentence using pre-recorded audio files
 * @param sentence The sentence to pronounce
 * @returns Promise that resolves when audio playback ends
 */
export async function playSentencePronunciation(sentence: string): Promise<void> {
  // Convert the sentence to a filename-friendly format
  const normalizedSentence = sentence
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")

  const filePath = `/audio/sentences/${normalizedSentence}.mp3`

  try {
    await playAudioFile(filePath)
    return Promise.resolve()
  } catch (error) {
    console.error(`Error playing sentence pronunciation for "${sentence}":`, error)
    return fallbackAudio(sentence)
  }
}

/**
 * Fallback audio method when audio file is not available
 * @param text Text to pronounce
 * @returns Promise that resolves when fallback audio ends
 */
function fallbackAudio(text: string): Promise<void> {
  return new Promise((resolve) => {
    // Try Speech Synthesis first
    if ("speechSynthesis" in window) {
      speechSynthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = "en-US"
      utterance.rate = 0.8
      utterance.pitch = 1
      utterance.volume = 1

      utterance.onend = () => {
        resolve()
      }

      utterance.onerror = () => {
        // If Speech Synthesis fails, use Web Audio API
        playBeepSound(text.length * 100)
        setTimeout(resolve, text.length * 100)
      }

      setTimeout(() => {
        speechSynthesis.speak(utterance)
      }, 100)
    } else {
      // If Speech Synthesis is not available, use Web Audio API
      playBeepSound(text.length * 100)
      setTimeout(resolve, text.length * 100)
    }
  })
}

/**
 * Plays a beep sound using Web Audio API
 * @param duration Duration of the beep in milliseconds
 */
function playBeepSound(duration = 500): void {
  if ("AudioContext" in window || "webkitAudioContext" in window) {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext
    const audioContext = new AudioContext()

    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.type = "sine"
    oscillator.frequency.setValueAtTime(440, audioContext.currentTime)
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)

    oscillator.start()
    oscillator.stop(audioContext.currentTime + duration / 1000)
  }
}
