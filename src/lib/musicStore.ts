export interface Track {
  title: string;
  author: string;
  url: string;
  pic: string;
}

export const PLAYLIST_ID = '9333187603';

const FALLBACK_TRACKS: Track[] = [
  {
    title: '夜的钢琴曲 (五)',
    author: '石进',
    url: 'https://music.163.com/song/media/outer/url?id=149297.mp3',
    pic: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&q=80',
  },
  {
    title: 'River Flows in You',
    author: 'Yiruma',
    url: 'https://music.163.com/song/media/outer/url?id=149294.mp3',
    pic: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=400&q=80',
  },
  {
    title: 'Summer',
    author: '久石让',
    url: 'https://music.163.com/song/media/outer/url?id=441552.mp3',
    pic: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&q=80',
  },
];

interface MusicState {
  tracks: Track[];
  currentIndex: number;
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  currentTime: number;
  duration: number;
  isLoading: boolean;
  errorMsg: string;
}

type Listener = (state: MusicState) => void;

class GlobalMusicStore {
  private audio: HTMLAudioElement | null = null;
  private listeners = new Set<Listener>();
  private initialized = false;
  private consecutiveErrors = 0;

  public state: MusicState = {
    tracks: FALLBACK_TRACKS,
    currentIndex: 0,
    isPlaying: false,
    volume: 70,
    isMuted: false,
    currentTime: 0,
    duration: 0,
    isLoading: true,
    errorMsg: '',
  };

  private initAudio() {
    if (typeof window === 'undefined' || this.initialized) return;
    this.initialized = true;

    const win = window as any;
    if (win.__larryAudio instanceof HTMLAudioElement) {
      this.audio = win.__larryAudio;
      if (win.__larryMusicState) {
        this.state = { ...this.state, ...win.__larryMusicState };
      }
    } else {
      this.audio = new Audio();
      this.audio.volume = this.state.volume / 100;
      win.__larryAudio = this.audio;
      this.fetchPlaylist();
    }

    const audio = this.audio;
    audio.ontimeupdate = () => {
      this.consecutiveErrors = 0;
      this.update({ currentTime: audio.currentTime, duration: audio.duration || 0, errorMsg: '' });
    };
    audio.onplay = () => this.update({ isPlaying: true, errorMsg: '' });
    audio.onpause = () => this.update({ isPlaying: false });
    audio.onended = () => {
      this.consecutiveErrors = 0;
      this.next();
    };
    audio.onerror = () => {
      this.consecutiveErrors += 1;
      if (this.consecutiveErrors < 2 && this.state.tracks.length > 1) {
        setTimeout(() => this.next(), 350);
      } else {
        this.update({
          isPlaying: false,
          errorMsg: '当前音源受限，请点击其他曲目或切换「网易云官方外链」播放',
        });
      }
    };
  }

  private async fetchPlaylist() {
    const apis = [
      `https://api.i-meto.com/meting/api?server=netease&type=playlist&id=${PLAYLIST_ID}`,
      `https://api.injahow.cn/meting/?type=playlist&id=${PLAYLIST_ID}`,
    ];
    for (const api of apis) {
      try {
        const res = await fetch(api);
        if (!res.ok) continue;
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const parsed: Track[] = data
            .filter((t: any) => t.url)
            .map((t: any) => ({
              title: t.title || t.name || '未知曲目',
              author: t.author || t.artist || '未知歌手',
              url: t.url.replace(/^http:\/\//, 'https://'),
              pic: (t.pic || '').replace(/^http:\/\//, 'https://') || FALLBACK_TRACKS[0].pic,
            }));
          if (parsed.length > 0) {
            this.update({ tracks: parsed, isLoading: false });
            if (this.audio && !this.audio.src) {
              this.audio.src = parsed[0].url;
            }
            return;
          }
        }
      } catch {}
    }
    this.update({ isLoading: false });
    if (this.audio && !this.audio.src) {
      this.audio.src = this.state.tracks[0].url;
    }
  }

  private update(partial: Partial<MusicState>) {
    this.state = { ...this.state, ...partial };
    if (typeof window !== 'undefined') {
      (window as any).__larryMusicState = this.state;
    }
    this.listeners.forEach((fn) => fn(this.state));
  }

  public subscribe(fn: Listener) {
    this.initAudio();
    this.listeners.add(fn);
    fn(this.state);
    return () => {
      this.listeners.delete(fn);
    };
  }

  public playTrack(index: number) {
    this.initAudio();
    this.consecutiveErrors = 0;
    const safeIdx = (index + this.state.tracks.length) % this.state.tracks.length;
    const track = this.state.tracks[safeIdx];
    if (!this.audio || !track) return;
    if (this.audio.src !== track.url) {
      this.audio.src = track.url;
    }
    this.update({ currentIndex: safeIdx, errorMsg: '' });
    this.audio.play().catch(() => {
      this.update({ isPlaying: false });
    });
  }

  public togglePlay() {
    this.initAudio();
    this.consecutiveErrors = 0;
    if (!this.audio) return;
    if (!this.audio.src && this.state.tracks[this.state.currentIndex]) {
      this.audio.src = this.state.tracks[this.state.currentIndex].url;
    }
    if (this.audio.paused) {
      this.audio.play().catch(() => {
        this.update({ isPlaying: false, errorMsg: '浏览器拦截或音源不可用，请点击曲目或使用官方外链' });
      });
    } else {
      this.audio.pause();
    }
  }

  public next() {
    this.playTrack(this.state.currentIndex + 1);
  }

  public prev() {
    this.playTrack(this.state.currentIndex - 1);
  }

  public setVolume(val: number) {
    this.initAudio();
    const clamped = Math.max(0, Math.min(100, val));
    if (this.audio) {
      this.audio.volume = clamped / 100;
      this.audio.muted = false;
    }
    this.update({ volume: clamped, isMuted: false });
  }

  public toggleMute() {
    this.initAudio();
    const nextMuted = !this.state.isMuted;
    if (this.audio) {
      this.audio.muted = nextMuted;
    }
    this.update({ isMuted: nextMuted });
  }

  public seek(time: number) {
    if (this.audio && !isNaN(time)) {
      this.audio.currentTime = time;
    }
  }
}

export const musicStore = new GlobalMusicStore();
