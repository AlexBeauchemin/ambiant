import * as types from '../constants/action-types';

const openModal = (modal) => {
  return {
    type: types.OPEN_MODAL,
    modal
  };
};

const closeModal = () => {
  return {
    type: types.CLOSE_MODAL
  };
};

export { openModal, closeModal };