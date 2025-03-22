import * as React from 'react';
import {
  Title2,
  Card,
  Button,
  Input,
  makeStyles,
  tokens,
  MessageBar,
  MessageBarBody,
  Label,
} from '@fluentui/react-components';
import { Delete24Regular } from '@fluentui/react-icons';
import * as tagApi from '../../wailsjs/go/services/TagServiceImpl.js';

interface Tag {
  id: number;
  name: string;
}

interface TagManagementProps {
  tags: Tag[];
  onTagsChange: (tags: Tag[]) => void;
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
  item: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 8px',
    margin: '0 4px 4px 0',
    backgroundColor: tokens.colorNeutralBackground2,
    borderRadius: tokens.borderRadiusMedium,
  },
  list: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '4px',
  },
  deleteIcon: {
    cursor: 'pointer',
    color: tokens.colorNeutralForeground2,
    ':hover': {
      color: tokens.colorNeutralForeground1,
    },
  },
});

export const TagManagement: React.FC<TagManagementProps> = ({
  tags,
  onTagsChange,
}) => {
  const [newTagName, setNewTagName] = React.useState('');
  const [nextId, setNextId] = React.useState(1);
  const [editingTagName, setEditingTag] = React.useState<string | null>(null);
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

  const createTag = async (name: string) => {
    const response = await tagApi.Create(name);
    return response;
  };

  const deleteTag = async (id: number) => {
    await tagApi.Delete(id);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!newTagName.trim()) return;

    if (editingTagName) {
      onTagsChange(
        tags.map((tag) =>
          tag.name === editingTagName ? { ...tag, name: newTagName } : tag
        )
      );
    } else {
      const newTag = { id: nextId, name: newTagName };
      const res = createTag(newTag.name);
      res.then((res) => {
        if (res.hasOwnProperty('success') && res['success'] === 0) {
          setError(res['msg']);
          setSuccess(null);
          return;
        } else {
          setError(null);
          setSuccess('标签创建成功');
          // 重置输入框
          setNewTagName('');
          setEditingTag(null);
        }
      });

      setNextId(nextId + 1);
      onTagsChange([...tags, newTag]);
    }
  };

  const handleEdit = (tag: Tag) => {
    setNewTagName(tag.name);
    setEditingTag(tag.name);
  };

  const handleDelete = (tag: Tag) => {
    deleteTag(tag.id);
    onTagsChange(tags.filter((t) => t.id !== tag.id));
  };

  return (
    <div className={styles.container}>
      <Card className={styles.cardContainer}>
        <Title2>标签</Title2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <Input
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              placeholder="输入标签名称"
              required
            />
            <Button type="submit" appearance="primary">
              {editingTagName ? '更新' : '添加'}
            </Button>
            {editingTagName && (
              <Button
                onClick={() => {
                  setNewTagName('');
                  setEditingTag(null);
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
          {tags.map((tag) => (
            <div key={tag.id} className={styles.item}>
              <Label>{tag.name}</Label>
              <Delete24Regular
                className={styles.deleteIcon}
                onClick={() => handleDelete(tag)}
              />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
