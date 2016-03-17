import _ from 'lodash';

export const getSongImage = (song) => {
  const defaultImage = '/album-default.jpg';
  const highDef = _.get(song, 'data.thumbnails.high.url');
  const lowDef = _.get(song, 'data.thumbnails.default.url');

  if (highDef) return highDef;
  if (lowDef) return lowDef;

  return defaultImage;
};
