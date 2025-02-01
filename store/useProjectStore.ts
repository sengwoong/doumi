import { create } from 'zustand';

interface ProjectStore {
  notionTitle: string;
  projectId: string | null;
  setNotionTitle: (title: string) => void;
  setProjectId: (id: string | null) => void;
}

export const useProjectStore = create<ProjectStore>((set) => ({
  notionTitle: '',
  projectId: null,
  setNotionTitle: (title) => set({ notionTitle: title }),
  setProjectId: (id) => set({ projectId: id }),
})); 