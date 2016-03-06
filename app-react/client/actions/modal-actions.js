import * as types from '../constants/action-types';

const openModal = (modal) => {
  return {
    modal,
    type: types.OPEN_MODAL
  };
};

const closeModal = () => {
  return {
    type: types.CLOSE_MODAL
  };
};

export { openModal, closeModal };
