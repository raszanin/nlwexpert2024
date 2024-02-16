import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { useState, ChangeEvent, FormEvent } from 'react'
import { toast } from 'sonner'

interface NewNoteCardProps {
  onNoteCreated: (content: string) => void
}

let speechRecognition: SpeechRecognition | null = null

export function NewNoteCard({ onNoteCreated }: NewNoteCardProps) {
  const [shouldShowOnboarding, setShouldShowOnboarding] = useState(true)
  const [content, setContent] = useState('') 
  const [isRecording, setIsRecording] = useState(false)

  function handleStartEditor() {
    setShouldShowOnboarding(false);
  }

  function handleContentChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setContent(e.target.value)
    
    if (e.target.value === '') {
      setShouldShowOnboarding(true)
    }
  }

  function handleSaveNote(event: FormEvent) {
    event.preventDefault()

    if (content === '') {
      toast.error('A nota não pode estar vazia!')
      setShouldShowOnboarding(true)
      return
    }

    onNoteCreated(content)
    setContent('')
    setShouldShowOnboarding(true)
    toast.success('Nota salva com sucesso!')
  }

  function resetInterface() {
    setContent('')
    setShouldShowOnboarding(true)
  }

  function handleStartRecording(event: FormEvent) {
    event.preventDefault()
    
    // Check if the SpeechRecognition API is available
    const isSpeechRecognitionAPIAvailable = 'SpeechRecognition' in window
    || 'webkitSpeechRecognition' in window

    if (!isSpeechRecognitionAPIAvailable) {
      toast.error('Seu navegador não suporta a API de reconhecimento de voz.')
      setIsRecording(false)
      return
    }

    // Start recording
    setIsRecording(true)
    setShouldShowOnboarding(false)
    
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition

    speechRecognition = new SpeechRecognitionAPI()

    speechRecognition.lang = 'pt-BR'
    speechRecognition.continuous = true
    speechRecognition.maxAlternatives = 1
    speechRecognition.interimResults = true

    speechRecognition.onresult = (event) => {
      const transcription = Array.from(event.results).reduce((text, result) => { 
        return text.concat(result[0].transcript)
      }, '')

      setContent(transcription)
    }

    speechRecognition.onerror = (event) => {
      console.error(event.error)
    }

    speechRecognition.start()
  }

  function handleStopRecording(event: FormEvent) {
    event.preventDefault()
    setIsRecording(false)
    
    if (speechRecognition != null) {
      speechRecognition.stop()
      speechRecognition = null
    }
  }
  
  return (
    <Dialog.Root>
      <Dialog.Trigger className='rounded-md flex flex-col gap-3 text-left bg-slate-700 p-5 hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400'>
        <span className='text-sm font-medium text-slate-200'>Adicionar nota</span>
        <p className='text-sm leading-6 text-slate-400'>Grave uma nota em áudio que será convertida para texto automaticamente.</p>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className='fixed inset-0 bg-black/50' /> 
        <Dialog.Content className='fixed inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] w-full md:h-[60vh] bg-slate-700 md:rounded-md overflow-hidden flex flex-col outline-none'>
          <Dialog.Close onClick={resetInterface} className='absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100 outline-none'>
            <X className='size-5 '/>
          </Dialog.Close>

          <form className='flex-1 flex flex-col'>          
            <div className='flex flex-1 flex-col gap-3 p-5'>
              <span className='text-sm font-medium text-slate-200'>
                Adicionar nota 
              </span>
          
              {shouldShowOnboarding ? (
                <p className='text-sm leading-6 text-slate-400'>
                  Comece <button className='font-medium text-lime-400 hover:underline' onClick={handleStartRecording}>gravando</button> uma nota em áudio que será convertida para texto automaticamente, ou se preferir <button className='font-medium text-lime-400 hover:underline' onClick={handleStartEditor}>utilize apenas texto</button>. 
                </p> 
              ) : (
                <textarea 
                  autoFocus 
                  className='text-sm leading-6 text-slate-400 bg-transparent resize-none flex-1 outline-none' 
                  placeholder='Digite sua nota aqui...'
                  onChange={handleContentChange}
                  value={content}
                />
              )}
            </div>

            {isRecording ? (
              <button type="button" onClick={handleStopRecording} className='flex items-center justify-center gap-2 animate-pulse w-full bg-slate-900 py-4 text-center text-sm text-slate-300 outline-none font-medium hover:text-slate-100'>
                <div className='size-3 rounded-full bg-red-500 '/>
                Gravando! (Clique para interromper)
              </button>
            ) : (
              <button type="button" onClick={handleSaveNote} className='w-full bg-lime-400 py-4 text-center text-sm text-lime-950 outline-none font-medium hover:bg-lime-500'>
                Salvar nota
              </button>
            )}

            
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>    
  )
}