// src/types/jitsi.d.ts (または MeetingRoomPage.tsx の先頭)

interface JitsiMeetExternalAPI {
  dispose: () => void;
  addEventListener: (event: string, handler: (event: any) => void) => void;
  executeCommand: (command: string, ...args: any[]) => void;
  // 他にも使うメソッドがあればここに追加
  // 例えば、muteStatusChanged イベントの event オブジェクトの型も定義する
  // (event: { muted: boolean }) => void;
}

interface Window {
  JitsiMeetExternalAPI: {
    new (domain: string, options: any): JitsiMeetExternalAPI;
  };
}

// Jitsi API のイベントハンドラに渡されるイベントオブジェクトの型も定義
interface JitsiAudioMuteEvent {
  muted: boolean;
}
interface JitsiVideoMuteEvent {
  muted: boolean;
}
interface JitsiScreenSharingEvent {
  on: boolean;
}
// 必要であれば他のイベントの型も追加