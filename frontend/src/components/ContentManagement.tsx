import * as React from 'react';
import {
  Text,
  Title1,
  Card,
  CardHeader,
  Button,
  Input,
  Textarea,
  makeStyles,
  tokens,
  TabList,
  Tab,
  SelectTabData,
  SelectTabEvent,
  TabValue,
  Combobox,
  Option,
} from '@fluentui/react-components';
import { TabContent } from './TabContent.tsx';
import { NotificationProvider } from './NotificationContext.tsx';
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

const useStyles = makeStyles({
  root: {
    backgroundColor: tokens.colorNeutralBackground2,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stack: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  card: {
    padding: tokens.spacingVerticalXXL,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px',
    marginTop: '20px',
  },
  noteList: {
    marginTop: '20px',
  },
  noteItem: {
    padding: '10px',
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    borderRadius: tokens.borderRadiusMedium,
    marginBottom: '10px',
  },
});

export const ContentManagement: React.FC = () => {
  const [selectedTab, setSelectedTab] = React.useState<TabValue>('notes');
  const [notes, setNotes] = React.useState<Note[]>([]);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [currentNote, setCurrentNote] = React.useState<Note>({
    id: 0,
    front: '',
    back: '',
    categories: [],
    tags: [],
  });

  const styles = useStyles();

  const handleTabSelect = (event: SelectTabEvent, data: SelectTabData) => {
    setSelectedTab(data.value);
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setCurrentNote((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (currentNote.id === 0) {
      // Add new note
      setNotes([...notes, { ...currentNote, id: Date.now() }]);
    } else {
      // Update existing note
      setNotes(
        notes.map((note) => (note.id === currentNote.id ? currentNote : note))
      );
    }
    setCurrentNote({ id: 0, front: '', back: '' });
  };

  const handleEdit = (note: Note) => {
    setCurrentNote(note);
  };

  const handleDelete = (id: number) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  return (
      <div className={`${styles.stack} w-[780px] h-[480px]`}>
        <Card
          className={`${styles.card} p-5 flex flex-col w-full h-full overflow-auto`}
        >
          <CardHeader header={<Title1>内容管理</Title1>} />
          <TabList selectedValue={selectedTab} onTabSelect={handleTabSelect}>
            <Tab value="notes">笔记管理</Tab>
            <Tab value="categories">分类管理</Tab>
          </TabList>

          <TabContent
            selectedTab={selectedTab}
            notes={notes}
            categories={categories}
            onNotesChange={setNotes}
            onCategoriesChange={setCategories}
          />
        </Card>
      </div>
  );
};
