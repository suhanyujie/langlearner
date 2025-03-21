import * as React from 'react';
import { TabValue } from '@fluentui/react-components';
import { NoteManagement } from './NoteManagement.tsx';
import { CategoryAndTagManagement } from './CategoryAndTagManagement.tsx';

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
  tags: Tag[];
  onNotesChange: (notes: Note[]) => void;
  onCategoriesChange: (categories: Category[]) => void;
  onTagsChange: (tags: Tag[]) => void;
}

export const TabContent: React.FC<TabContentProps> = ({
  selectedTab,
  notes,
  categories,
  tags,
  onNotesChange,
  onCategoriesChange,
  onTagsChange,
}) => {
  switch (selectedTab) {
    case 'notes':
      return (
        <NoteManagement
          notes={notes}
          categories={categories}
          tags={tags}
          onNotesChange={onNotesChange}
        />
      );
    case 'categories':
      return (
        <CategoryAndTagManagement
          type="categories"
          items={categories}
          onItemsChange={onCategoriesChange}
        />
      );
    case 'tags':
      return (
        <CategoryAndTagManagement
          type="tags"
          items={tags}
          onItemsChange={onTagsChange}
        />
      );
    default:
      return null;
  }
};
