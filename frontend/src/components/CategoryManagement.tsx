import * as React from 'react';
import {
  Text,
  Title2,
  Card,
  Button,
  Input,
  makeStyles,
  tokens,
  MessageBar,
  MessageBarBody,
} from '@fluentui/react-components';

interface Category {
  id: number;
  name: string;
}

interface CategoryManagementProps {
  categories: Category[];
  onCategoriesChange: (categories: Category[]) => void;
}

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    padding: '20px',
  },
  cardContainer: {
    position: 'relative',
  },
  messageBar: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    zIndex: 1,
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

export const CategoryManagement: React.FC<CategoryManagementProps> = ({
  categories,
  onCategoriesChange,
}) => {
  const [newCategoryName, setNewCategoryName] = React.useState('');
  const [nextId, setNextId] = React.useState(1);
  const [editingCategoryName, setEditingCategory] = React.useState<
    string | null
  >(null);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (error || success) {
      timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 3000);
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [error, success]);

  const styles = useStyles();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!newCategoryName.trim()) return;

    if (editingCategoryName) {
      onCategoriesChange(
        categories.map((category) =>
          category.name === editingCategoryName
            ? { ...category, name: newCategoryName }
            : category
        )
      );
    } else {
      const newCategory = { id: nextId, name: newCategoryName };
      setNextId(nextId + 1);
      onCategoriesChange([...categories, newCategory]);
    }

    setNewCategoryName('');
    setEditingCategory(null);
  };

  const handleEdit = (category: Category) => {
    setNewCategoryName(category.name);
    setEditingCategory(category.name);
  };

  const handleDelete = (category: Category) => {
    onCategoriesChange(categories.filter((c) => c.id !== category.id));
  };

  return (
    <div className={styles.container}>
      <Card className={styles.cardContainer}>
        <Title2>分类</Title2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <Input
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="输入分类名称"
              required
            />
            <Button type="submit" appearance="primary">
              {editingCategoryName ? '更新' : '添加'}
            </Button>
            {editingCategoryName && (
              <Button
                onClick={() => {
                  setNewCategoryName('');
                  setEditingCategory(null);
                }}
              >
                取消
              </Button>
            )}
          </div>
          <div className={styles.messageBar}>
            {error && (
              <MessageBar intent="error">
                <MessageBarBody>{error}</MessageBarBody>
              </MessageBar>
            )}
            {success && (
              <MessageBar intent="success">
                <MessageBarBody>{success}</MessageBarBody>
              </MessageBar>
            )}
          </div>
        </form>

        <div className={styles.list}>
          {categories.map((category) => (
            <div key={category.id} className={styles.item}>
              <Text>{category.name}</Text>
              <div className={styles.buttonGroup}>
                <Button onClick={() => handleEdit(category)}>编辑</Button>
                <Button onClick={() => handleDelete(category)}>删除</Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
