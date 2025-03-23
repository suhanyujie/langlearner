import * as React from 'react';
import { TabValue } from '@fluentui/react-components';
import { NoteManagement } from './NoteManagement.tsx';
import { CategoryManagement } from './CategoryManagement.tsx';
import { TagManagement } from './TagManagement.tsx';
import * as tagApi from '../../wailsjs/go/services/TagServiceImpl.js';

interface Category {
  id: number;
  name: string;
}

interface Tag {
  id: number;
  name: string;
}

interface Note {
  id: number;
  front: string;
  back: string;
  imageUrl?: string;
  audioUrl?: string;
  categories?: Category[];
  tags?: Tag[];
}

interface TabContentProps {
  selectedTab: TabValue;
  notes: Note[];
  categories: Category[];
  onNotesChange: (notes: Note[]) => void;
  onCategoriesChange: (categories: Category[]) => void;
}

export const TabContent: React.FC<TabContentProps> = ({
  selectedTab,
  notes,
  categories,
  onNotesChange,
  onCategoriesChange,
}) => {
  React.useEffect(() => {
    if (selectedTab === 'tags') {
      const loadTags = async () => {
        try {
          const response = await tagApi.List(1, 100, '');
          if (response && response.data && response.data.data) {
          }
        } catch (error) {
          console.error('Failed to load tags:', error);
        }
      };
      loadTags();
    }
  }, [selectedTab]);
  switch (selectedTab) {
    case 'notes':
      return (
        <NoteManagement
          notes={notes}
          categories={categories}
          onNotesChange={onNotesChange}
        />
      );
    case 'categories':
      return (
        <CategoryManagement
          categories={categories}
          onCategoriesChange={onCategoriesChange}
        />
      );
    // case 'tags':
    //   return <TagManagement />;
    default:
      return null;
  }
};
