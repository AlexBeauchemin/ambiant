import * as types from '../constants/action-types';

export function openModal(modal) {
  return {
    modal,
    type: types.OPEN_MODAL
  };
}

export function closeModal() {
  return {
    type: types.CLOSE_MODAL
  };
}

export { openModal, closeModal };
