import SoundCloudProvider from './music-provider/soundcloud';
import YoutubeProvider from './music-provider/youtube';

const SoundCloud = new SoundCloudProvider();
const Youtube = new YoutubeProvider();

export default {
  soundcloud: SoundCloud,
  youtube: Youtube,
  current: Youtube,
  setCurrent(domain = 'youtube') {
    if (domain === 'youtube') this.current = Youtube;
    else this.current = SoundCloud;
  }
};



