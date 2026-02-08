import { create } from 'zustand';

interface ModalOptions {
  className?: string;
  hideCloseButton?: boolean;
  variant?: 'default' | 'clean';
}

interface ModalState {
  isOpen: boolean;
  content: React.ReactNode | null;
  options?: ModalOptions;
  openModal: (content: React.ReactNode, options?: ModalOptions) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  isOpen: false,
  content: null,
  options: undefined,
  openModal: (content, options) => set({ isOpen: true, content, options }),
  closeModal: () => set({ isOpen: false, content: null, options: undefined }),
}));
