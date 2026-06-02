import { useState, useRef, useEffect } from 'react';
import { Volume2, Mic, Square, Play, RotateCcw, CheckCircle } from 'lucide-react';

const STEPS = [
  { id: 'listen', label: 'Listen', icon: Volume2, desc: 'Press play and listen carefully to the correct pronunciation.' },
  { id: 'record', label: 'Record', icon: Mic, desc: 'Press the red button and say the letter clearly into your microphone.' },
  { id: 'review', label: 'Self-Review', icon: Play, desc: 'Play the correct audio, then play your recording. Notice any differences.' },
  { id: 'repeat', label: 'Repeat', icon: RotateCcw, desc: 'Practice again. Repeat until your pronunciation feels confident.' },
];

export default function AudioPractice({ letter, onClose }) {
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingBlob, setRecordingBlob] = useState(null);
  const [isPlayingRecording, setIsPlayingRecording] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [repeatCount, setRepeatCount] = useState(0);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const recordingAudioRef = useRef(null);

  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
      if (mediaRecorderRef.current?.state === 'recording') mediaRecorderRef.current.stop();
    };
  }, []);

  const playCorrect = () => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    if (isPlaying) { setIsPlaying(false); return; }
    const utt = new SpeechSynthesisUtterance(letter.arabic);
    utt.lang = 'ar-SA'; utt.rate = 0.6; utt.pitch = 1;
    utt.onstart = () => setIsPlaying(true);
    utt.onend = () => setIsPlaying(false);
    utt.onerror = () => setIsPlaying(false);
    window.speechSynthesis.speak(utt);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunksRef.current = [];
      const mr = new MediaRecorder(stream);
      mediaRecorderRef.current = mr;
      mr.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.onstop = () => {
        setRecordingBlob(new Blob(chunksRef.current, { type: 'audio/webm' }));
        stream.getTracks().forEach(t => t.stop());
      };
      mr.start();
      setIsRecording(true);
      setPermissionDenied(false);
    } catch { setPermissionDenied(true); }
  };

  const stopRecording = () => { mediaRecorderRef.current?.stop(); setIsRecording(false); };

  const playRecording = () => {
    if (!recordingBlob) return;
    if (isPlayingRecording) { recordingAudioRef.current?.pause(); setIsPlayingRecording(false); return; }
    const audio = new Audio(URL.createObjectURL(recordingBlob));
    recordingAudioRef.current = audio;
    audio.play();
    setIsPlayingRecording(true);
    audio.onended = () => setIsPlayingRecording(false);
  };

  const handleRepeat = () => { setRecordingBlob(null); setStep(0); setRepeatCount(c => c + 1); window.speechSynthesis?.cancel(); };
  const canGoNext = () => step === 0 || step === 2 || (step === 1 && !!recordingBlob);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-[#0f2318] border border-emerald-900 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="bg-emerald-950/60 border-b border-emerald-900 p-5 text-center">
          <div className="text-7xl font-bold text-white mb-1">{letter.arabic}</div>
          <div className="text-emerald-400 font-semibold">{letter.name}</div>
          <div className="text-slate-500 text-xs mt-1 leading-relaxed px-4">{letter.makhraj}</div>
        </div>

        <div className="flex border-b border-white/8">
          {STEPS.map((s, i) => (
            <button key={s.id} onClick={() => i <= step && setStep(i)}
              className={`flex-1 py-2.5 text-xs font-semibold flex flex-col items-center gap-0.5 transition-colors ${i === step ? 'bg-emerald-900/50 text-emerald-400' : i < step ? 'text-emerald-600 hover:text-emerald-400' : 'text-slate-600'}`}>
              <s.icon className="w-3.5 h-3.5" />
              <span className="hidden sm:block">{s.label}</span>
              <span className="sm:hidden">{i + 1}</span>
            </button>
          ))}
        </div>

        <div className="p-6">
          <div className="text-center mb-5">
            <h3 className="font-bold text-white text-lg mb-1">{STEPS[step].label}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{STEPS[step].desc}</p>
          </div>

          {step === 0 && (
            <button onClick={playCorrect} className={`w-full py-4 rounded-2xl flex items-center justify-center gap-3 font-semibold text-sm transition-all ${isPlaying ? 'bg-emerald-900/60 border border-emerald-600 text-emerald-300' : 'bg-emerald-600 hover:bg-emerald-500 text-white'}`}>
              <Volume2 className="w-5 h-5" />{isPlaying ? 'Playing...' : 'Play Correct Pronunciation'}
            </button>
          )}

          {step === 1 && (
            <div className="space-y-3">
              {permissionDenied && <div className="bg-red-900/30 border border-red-800 rounded-xl p-3 text-xs text-red-300 text-center">Microphone access denied.</div>}
              {!isRecording && !recordingBlob && (
                <button onClick={startRecording} className="w-full py-4 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-semibold text-sm flex items-center justify-center gap-3 transition-all">
                  <Mic className="w-5 h-5" />Start Recording
                </button>
              )}
              {isRecording && (
                <button onClick={stopRecording} className="w-full py-4 rounded-2xl bg-red-800 border-2 border-red-400 text-white font-semibold text-sm flex items-center justify-center gap-3 animate-pulse">
                  <Square className="w-4 h-4 fill-white" />Stop Recording
                </button>
              )}
              {recordingBlob && !isRecording && (
                <div className="space-y-2">
                  <div className="bg-emerald-900/30 border border-emerald-800 rounded-xl p-3 text-emerald-400 text-sm text-center font-medium">✓ Recording saved</div>
                  <button onClick={playRecording} className="w-full py-3 rounded-xl bg-white/8 border border-white/10 text-white text-sm font-medium flex items-center justify-center gap-2 hover:bg-white/15 transition-all">
                    <Play className={`w-4 h-4 ${isPlayingRecording ? 'text-emerald-400' : ''}`} />
                    {isPlayingRecording ? 'Playing...' : 'Preview Recording'}
                  </button>
                  <button onClick={() => setRecordingBlob(null)} className="w-full py-2.5 rounded-xl text-slate-400 text-xs hover:text-white transition-colors">Record Again</button>
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3">
              <button onClick={playCorrect} className={`w-full py-3.5 rounded-2xl flex items-center justify-center gap-3 font-semibold text-sm transition-all ${isPlaying ? 'bg-emerald-900/60 border border-emerald-600 text-emerald-300' : 'bg-emerald-600 hover:bg-emerald-500 text-white'}`}>
                <Volume2 className="w-4 h-4" />{isPlaying ? 'Playing...' : 'Play Correct Pronunciation'}
              </button>
              <button onClick={playRecording} disabled={!recordingBlob} className={`w-full py-3.5 rounded-2xl flex items-center justify-center gap-3 font-semibold text-sm transition-all ${isPlayingRecording ? 'bg-sky-900/60 border border-sky-600 text-sky-300' : recordingBlob ? 'bg-sky-700 hover:bg-sky-600 text-white' : 'bg-white/5 border border-white/10 text-slate-600 cursor-not-allowed'}`}>
                <Play className="w-4 h-4" />{isPlayingRecording ? 'Playing your voice...' : 'Play Your Recording'}
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3 text-center">
              <div className="py-3 text-slate-400 text-sm">
                {repeatCount > 0 ? <span className="text-emerald-400 font-semibold">You've practised {repeatCount + 1} times. Keep going! 💪</span> : 'Repetition builds correct habits.'}
              </div>
              <button onClick={handleRepeat} className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm flex items-center justify-center gap-3 transition-all">
                <RotateCcw className="w-4 h-4" />Practise Again
              </button>
              <button onClick={onClose} className="w-full py-2.5 rounded-xl text-slate-400 text-sm hover:text-white transition-colors flex items-center justify-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" />Mark as Done
              </button>
            </div>
          )}
        </div>

        {step < 3 && (
          <div className="border-t border-white/8 flex gap-2 p-4">
            <button onClick={onClose} className="px-4 py-2.5 rounded-xl text-slate-500 text-sm hover:text-white transition-colors">Close</button>
            <div className="flex-1" />
            {step > 0 && <button onClick={() => setStep(s => s - 1)} className="px-4 py-2.5 rounded-xl bg-white/8 border border-white/10 text-slate-300 text-sm hover:text-white transition-all">← Back</button>}
            <button onClick={() => canGoNext() && setStep(s => s + 1)} disabled={!canGoNext()}
              className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${canGoNext() ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 'bg-white/5 text-slate-600 cursor-not-allowed'}`}>
              {step === 1 && !recordingBlob ? 'Record first' : 'Next →'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
