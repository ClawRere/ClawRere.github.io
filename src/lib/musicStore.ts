export interface Track {
  title: string;
  author: string;
  url: string;
  pic: string;
}

export const NETEASE_PLAYLISTS = [
  { id: '711502311', name: '专注轻音乐', desc: '默认推荐 · I Still Want Your Love' },
  { id: '9333187603', name: '免费精选歌单', desc: '全曲目免费可播' },
  { id: '901594222', name: '磊大大私藏', desc: '原博客经典歌单' },
  { id: '3778678', name: '网易云热歌榜', desc: '每周热门流行' },
  { id: '2884035', name: '网易云原创榜', desc: '独立音乐人佳作' },
];

export const DEFAULT_PLAYLIST_ID = '711502311';

const FALLBACK_TRACKS: Track[] = [
  {
    title: 'I Still Want Your Love',
    author: '专注轻音乐精选',
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
  playlistId: string;
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
    playlistId: DEFAULT_PLAYLIST_ID,
    tracks: FALLBACK_TRACKS,
    currentIndex: 0,
    isPlaying: false,
    volume: 10,
    isMuted: false,
    currentTime: 0,
    duration: 0,
    isLoading: true,
    errorMsg: '',
  };

  private initAudio() {
    if (typeof window === 'undefined' || this.initialized) return;
    this.initialized = true;

    const savedId = localStorage.getItem('selected_playlist_id') || DEFAULT_PLAYLIST_ID;
    const savedVolRaw = localStorage.getItem('music_volume');
    const initialVol = savedVolRaw !== null ? Math.max(0, Math.min(100, Number(savedVolRaw))) : 10;

    const win = window as any;
    if (win.__larryAudio instanceof HTMLAudioElement) {
      this.audio = win.__larryAudio;
      if (win.__larryMusicState) {
        this.state = { ...this.state, ...win.__larryMusicState };
      }
    } else {
      this.audio = new Audio();
      this.audio.volume = initialVol / 100;
      win.__larryAudio = this.audio;
      this.state = { ...this.state, playlistId: savedId, volume: initialVol };
      this.fetchPlaylist(savedId);
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
          errorMsg: '该曲目受版权/外链限制，可点击其他曲目或切换「网易云外链」',
        });
      }
    };
  }

  public async switchPlaylist(id: string) {
    this.initAudio();
    localStorage.setItem('selected_playlist_id', id);
    this.update({ playlistId: id, isLoading: true, errorMsg: '' });
    await this.fetchPlaylist(id);
  }

  private async fetchPlaylist(id: string) {
    const apis = [
      `https://api.i-meto.com/meting/api?server=netease&type=playlist&id=${id}`,
      `https://api.injahow.cn/meting/?type=playlist&id=${id}`,
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
            // Default to "I Still Want Your Love" when loading default playlist
            const targetIdx = parsed.findIndex((t) =>
              t.title.toLowerCase().includes('i still want your love')
            );
            const idx = targetIdx >= 0 ? targetIdx : 0;
            this.update({ tracks: parsed, currentIndex: idx, isLoading: false });
            if (this.audio && !this.state.isPlaying) {
              this.audio.src = parsed[idx].url;
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
        this.update({ isPlaying: false, errorMsg: '请点击曲目播放，或使用网易云外链' });
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
    localStorage.setItem('music_volume', String(clamped));
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
