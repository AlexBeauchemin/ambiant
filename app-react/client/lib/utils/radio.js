import { get as _get } from 'lodash';

export const getSongImage = (song) => {
  const defaultImage = '/album-default.jpg';
  const highDef = _get(song, 'data.thumbnails.high.url');
  const lowDef = _get(song, 'data.thumbnails.default.url');

  if (highDef) return highDef;
  if (lowDef) return lowDef;

  return defaultImage;
};
