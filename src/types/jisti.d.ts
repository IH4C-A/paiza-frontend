interface JitsiAudioMuteEvent {
  muted: boolean;
}
interface JitsiVideoMuteEvent {
  muted: boolean;
}
interface JitsiEventMap {
  audioMuteStatusChanged: JitsiAudioMuteEvent;
  videoMuteStatusChanged: JitsiVideoMuteEvent;
  [event: string]: unknown;
}

interface JitsiMeetExternalAPI {
  dispose: () => void;
  addEventListener<K extends keyof JitsiEventMap>(
    event: K,
    handler: (event: JitsiEventMap[K]) => void
  ): void;
  executeCommand: (command: string, ...args: unknown[]) => void;
}
