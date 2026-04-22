import React, { useEffect, useRef, useState } from "react";
import { C } from "../../design-system/tokens";

export default function AudioSection({ letterNum, autoPlayToken = 0 }) {
  const [status, setStatus] = useState("idle"); // idle | playing_model | recording | recorded | playing_recording
  const [mode, setMode] = useState("model"); // model | recording
  const [recordedUrl, setRecordedUrl] = useState(null);
  const [recSeconds, setRecSeconds] = useState(0);
  const [modelAvailable, setModelAvailable] = useState(true);
  const [modelErrorMessage, setModelErrorMessage] = useState("");

  const modelAudioRef = useRef(null);
  const recAudioRef = useRef(null);
  const mrRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const recUrlRef = useRef(null);
  const isFirstToken = useRef(true);

  useEffect(() => {
    setModelAvailable(true);
    setModelErrorMessage("");
    setStatus((prev) => (prev === "recorded" ? "recorded" : "idle"));
  }, [letterNum]);

  useEffect(() => {
    return () => {
      if (modelAudioRef.current) {
        modelAudioRef.current.pause();
        modelAudioRef.current = null;
      }
      if (recAudioRef.current) {
        recAudioRef.current.pause();
        recAudioRef.current = null;
      }
      if (mrRef.current && mrRef.current.state !== "inactive") {
        try {
          mrRef.current.stop();
        } catch (_) {}
      }
      if (recUrlRef.current) {
        URL.revokeObjectURL(recUrlRef.current);
      }
      clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (isFirstToken.current) {
      isFirstToken.current = false;
      return;
    }
    playCorrect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlayToken]);

  function stopAllPlayback() {
    if (modelAudioRef.current) {
      modelAudioRef.current.pause();
      modelAudioRef.current.currentTime = 0;
    }
    if (recAudioRef.current) {
      recAudioRef.current.pause();
      recAudioRef.current.currentTime = 0;
    }
  }

  function handleModelAudioFailure() {
    stopAllPlayback();
    setModelAvailable(false);
    setModelErrorMessage("Official audio for this letter is not uploaded yet. Please ask your teacher/admin to upload it.");
    setStatus(recordedUrl ? "recorded" : "idle");
  }

  function playCorrect() {
    stopAllPlayback();

    const audio = new Audio(`/audio/letter_${letterNum}.mp3`);
    modelAudioRef.current = audio;

    audio.onended = () => {
      setStatus(recordedUrl ? "recorded" : "idle");
    };

    audio.onerror = () => {
      handleModelAudioFailure();
    };

    audio
      .play()
      .then(() => {
        setModelAvailable(true);
        setModelErrorMessage("");
        setMode("model");
        setStatus("playing_model");
      })
      .catch(() => {
        handleModelAudioFailure();
      });
  }

  function stopPlayback() {
    stopAllPlayback();
    setStatus(recordedUrl ? "recorded" : "idle");
  }

  async function startRecording() {
    try {
      stopAllPlayback();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunksRef.current = [];

      const mr = new MediaRecorder(stream);
      mr.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mr.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });

        if (recUrlRef.current) {
          URL.revokeObjectURL(recUrlRef.current);
        }

        const url = URL.createObjectURL(blob);
        recUrlRef.current = url;
        setRecordedUrl(url);
        setMode("recording");
        setStatus("recorded");
        clearInterval(timerRef.current);
      };

      mrRef.current = mr;
      mr.start();
      setStatus("recording");
      setRecSeconds(0);
      timerRef.current = setInterval(() => setRecSeconds((s) => s + 1), 1000);
    } catch {
      alert("Microphone access is needed to record. Please allow microphone permission.");
    }
  }

  function stopRecording() {
    if (mrRef.current && mrRef.current.state !== "inactive") {
      mrRef.current.stop();
    }
    clearInterval(timerRef.current);
  }

  function playRecording() {
    if (!recUrlRef.current) {
      return;
    }

    stopAllPlayback();

    const audio = new Audio(recUrlRef.current);
    recAudioRef.current = audio;

    audio.play().catch(() => {});
    setMode("recording");
    setStatus("playing_recording");

    audio.onended = () => {
      setStatus("recorded");
    };
  }

  const hasRecording = Boolean(recordedUrl);

  const btnBase = {
    border: "none",
    borderRadius: 14,
    cursor: "pointer",
    fontWeight: 700,
    fontSize: 14,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    transition: "all 0.15s",
  };

  return (
    <div style={{ backgroundColor: C.beigeMid, borderTop: `1px solid ${C.beigeBorder}`, padding: "14px 16px" }}>
      <p
        style={{
          fontSize: 10,
          fontWeight: 800,
          color: C.inkMuted,
          textTransform: "uppercase",
          letterSpacing: 1.5,
          margin: "0 0 10px",
        }}
      >
        Practice Pronunciation
      </p>

      {!modelAvailable && modelErrorMessage && (
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 8,
            marginBottom: 10,
            backgroundColor: C.amberLight,
            borderRadius: 10,
            padding: "8px 10px",
            border: `1px solid ${C.amberBorder}`,
          }}
        >
          <span style={{ color: C.amber, fontWeight: 800 }}>i</span>
          <span style={{ fontSize: 12, color: C.amber, lineHeight: 1.5 }}>{modelErrorMessage}</span>
        </div>
      )}

      {status === "recording" && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 10,
            backgroundColor: C.recordLight,
            borderRadius: 10,
            padding: "8px 12px",
            border: "1px solid #f5c6c6",
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: C.record,
              display: "inline-block",
              animation: "pulse 1s infinite",
            }}
          />
          <span style={{ fontSize: 12, color: C.record, fontWeight: 700 }}>Recording... {recSeconds}s</span>
        </div>
      )}

      {status === "recorded" && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 10,
            backgroundColor: C.mint,
            borderRadius: 10,
            padding: "8px 12px",
            border: `1px solid ${C.mintDark}`,
          }}
        >
          <span style={{ fontSize: 14 }}>OK</span>
          <span style={{ fontSize: 12, color: C.forest, fontWeight: 700 }}>Recording saved - compare below</span>
        </div>
      )}

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {status !== "recording" && status !== "playing_model" && status !== "playing_recording" && (
          <button
            onClick={playCorrect}
            style={{ ...btnBase, flex: 1, minWidth: 120, padding: "12px 0", backgroundColor: C.forest, color: C.white }}
          >
            Play
          </button>
        )}

        {(status === "playing_model" || status === "playing_recording") && (
          <button
            onClick={stopPlayback}
            style={{ ...btnBase, flex: 1, minWidth: 120, padding: "12px 0", backgroundColor: C.forestMid, color: C.white }}
          >
            Stop
          </button>
        )}

        {status !== "playing_model" && status !== "playing_recording" && status !== "recording" && (
          <button
            onClick={startRecording}
            style={{
              ...btnBase,
              flex: 1,
              minWidth: 120,
              padding: "12px 0",
              backgroundColor: status === "recorded" ? C.beigeBorder : C.record,
              color: C.white,
            }}
          >
            {hasRecording ? "Record Again" : "Record"}
          </button>
        )}

        {status === "recording" && (
          <button
            onClick={stopRecording}
            style={{ ...btnBase, flex: 1, minWidth: 120, padding: "12px 0", backgroundColor: C.record, color: C.white }}
          >
            Stop Recording
          </button>
        )}
      </div>

      {hasRecording && status !== "recording" && (
        <div style={{ marginTop: 10 }}>
          <button
            onClick={playRecording}
            style={{
              ...btnBase,
              width: "100%",
              padding: "11px 0",
              backgroundColor: status === "playing_recording" ? C.forestMid : C.goldLight,
              color: status === "playing_recording" ? C.white : C.goldDark,
              border: `1px solid ${C.goldBorder}`,
            }}
          >
            {status === "playing_recording" ? "Playing your recording..." : "Replay"}
          </button>

          <div style={{ marginTop: 8, border: `1px solid ${C.beigeBorder}`, borderRadius: 10, overflow: "hidden", backgroundColor: C.white }}>
            <p style={{ margin: 0, padding: "8px 10px", fontSize: 11, fontWeight: 700, color: C.inkLight, borderBottom: `1px solid ${C.beigeBorder}` }}>
              Manual Compare
            </p>
            <div style={{ display: "flex" }}>
              <button
                onClick={playCorrect}
                disabled={!modelAvailable}
                style={{
                  ...btnBase,
                  flex: 1,
                  borderRadius: 0,
                  padding: "10px 0",
                  backgroundColor: mode === "model" ? C.forest : C.beigeCard,
                  color: mode === "model" ? C.white : C.inkMid,
                  opacity: modelAvailable ? 1 : 0.45,
                  cursor: modelAvailable ? "pointer" : "not-allowed",
                }}
              >
                Model Audio
              </button>
              <button
                onClick={playRecording}
                style={{
                  ...btnBase,
                  flex: 1,
                  borderRadius: 0,
                  padding: "10px 0",
                  backgroundColor: mode === "recording" ? C.forest : C.beigeCard,
                  color: mode === "recording" ? C.white : C.inkMid,
                }}
              >
                My Recording
              </button>
            </div>
          </div>

          <p style={{ fontSize: 11, color: C.inkMuted, textAlign: "center", margin: "7px 0 0" }}>
            Practice flow: Listen, Record, Replay, Repeat.
          </p>
        </div>
      )}
    </div>
  );
}
