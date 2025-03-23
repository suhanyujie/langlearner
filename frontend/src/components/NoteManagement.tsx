import * as React from 'react';
import {
  Text,
  Button,
  Input,
  Textarea,
  makeStyles,
  tokens,
  Combobox,
  Option,
} from '@fluentui/react-components';
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

interface NoteManagementProps {
  notes: Note[];
  categories: Category[];
  onNotesChange: (notes: Note[]) => void;
}

const useStyles = makeStyles({
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

export const NoteManagement: React.FC<NoteManagementProps> = ({
  notes,
  categories,
  onNotesChange,
}) => {
  const [currentNote, setCurrentNote] = React.useState<Note>({
    id: 0,
    front: '',
    back: '',
    categories: [],
    tags: [],
  });

  const styles = useStyles();

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
      onNotesChange([...notes, { ...currentNote, id: Date.now() }]);
    } else {
      // Update existing note
      onNotesChange(
        notes.map((note) => (note.id === currentNote.id ? currentNote : note))
      );
    }
    setCurrentNote({
      id: 0,
      front: '',
      back: '',
      categories: [],
      tags: [],
    });
  };

  const handleEdit = (note: Note) => {
    setCurrentNote(note);
  };

  const handleDelete = (id: number) => {
    onNotesChange(notes.filter((note) => note.id !== id));
  };

  return (
    <div className="mt-5">
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <Textarea
            name="front"
            value={currentNote.front}
            onChange={handleInputChange}
            placeholder="正面（句子）"
            required
          />
          <Textarea
            name="back"
            value={currentNote.back}
            onChange={handleInputChange}
            placeholder="背面（翻译）"
            required
          />
          <Combobox
            multiselect
            placeholder="选择分类"
            selectedOptions={currentNote.categories?.map((c) => c.name) || []}
            onOptionSelect={(e, data) => {
              const selectedCategories = categories.filter((c) =>
                data.selectedOptions.includes(c.name)
              );
              setCurrentNote((prev) => ({
                ...prev,
                categories: selectedCategories,
              }));
            }}
          >
            {categories.map((category) => (
              <Option key={category.id} value={category.name}>
                {category.name}
              </Option>
            ))}
          </Combobox>
   
        </div>
        <div className={styles.buttonGroup}>
          <Button type="submit" appearance="primary">
            {currentNote.id === 0 ? '添加' : '更新'}
          </Button>
          {currentNote.id !== 0 && (
            <Button
              onClick={() =>
                setCurrentNote({
                  id: 0,
                  front: '',
                  back: '',
                  categories: [],
                  tags: [],
                })
              }
            >
              取消
            </Button>
          )}
        </div>
      </form>

      <div className={styles.noteList}>
        {notes.map((note) => (
          <div key={note.id} className={styles.noteItem}>
            <Text block>{note.front}</Text>
            <Text block>{note.back}</Text>
            {note.categories && note.categories.length > 0 && (
              <Text block>分类: {note.categories.join(', ')}</Text>
            )}
            {note.tags && note.tags.length > 0 && (
              <Text block>标签: {note.tags.join(', ')}</Text>
            )}
            <div className={styles.buttonGroup}>
              <Button onClick={() => handleEdit(note)}>编辑</Button>
              <Button onClick={() => handleDelete(note.id)}>删除</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
