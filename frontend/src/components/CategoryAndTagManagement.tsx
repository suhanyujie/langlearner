import * as React from 'react';
import {
  Text,
  Title2,
  Card,
  Button,
  Input,
  makeStyles,
  tokens,
} from '@fluentui/react-components';

interface Category {
  id: number;
  name: string;
}

interface Tag {
  id: number;
  name: string;
}

interface CategoryAndTagManagementProps {
  type: 'categories' | 'tags';
  items: (Category | Tag)[];
  onItemsChange: (items: (Category | Tag)[]) => void;
}

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    padding: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '20px',
  },
  inputGroup: {
    display: 'flex',
    gap: '10px',
    alignItems: 'flex-end',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  item: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px',
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    borderRadius: tokens.borderRadiusMedium,
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px',
  },
});

export const CategoryAndTagManagement: React.FC<
  CategoryAndTagManagementProps
> = ({ type, items, onItemsChange }) => {
  const [newItemName, setNewItemName] = React.useState('');
  const [nextId, setNextId] = React.useState(1);
  const [editingItemName, setEditingItem] = React.useState<string | null>(null);

  const styles = useStyles();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!newItemName.trim()) return;

    if (editingItemName) {
      onItemsChange(
        items.map((item) =>
          item.name === editingItemName ? { ...item, name: newItemName } : item
        )
      );
    } else {
      const newItem = { id: nextId, name: newItemName };
      setNextId(nextId + 1);
      onItemsChange([...items, newItem]);
    }

    setNewItemName('');
    setEditingItem(null);
  };

  const handleEdit = (item: Category | Tag) => {
    setNewItemName(item.name);
    setEditingItem(item.name);
  };

  const handleDelete = (item: Category | Tag) => {
    onItemsChange(items.filter((i) => i.id !== item.id));
  };

  return (
    <div className={styles.container}>
      <Card>
        <Title2>{type === 'categories' ? '分类' : '标签'}</Title2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <Input
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              placeholder={`输入${type === 'categories' ? '分类' : '标签'}名称`}
              required
            />
            <Button type="submit" appearance="primary">
              {editingItemName ? '更新' : '添加'}
            </Button>
            {editingItemName && (
              <Button
                onClick={() => {
                  setNewItemName('');
                  setEditingItem(null);
                }}
              >
                取消
              </Button>
            )}
          </div>
        </form>

        <div className={styles.list}>
          {items.map((item) => (
            <div key={item.id} className={styles.item}>
              <Text>{item.name}</Text>
              <div className={styles.buttonGroup}>
                <Button onClick={() => handleEdit(item)}>编辑</Button>
                <Button onClick={() => handleDelete(item)}>删除</Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
