package services

import (
	"context"
	"errors"
	"log"
	"os"
	"path/filepath"
	"testing"

	"github.com/stretchr/testify/assert"
	"langlearner1/backend/storage"
	"langlearner1/backend/types"
)

func setupTestDB(t *testing.T) func() {
	// 创建临时测试数据库文件 `~/AppData/Local/Temp/langlearner-test`
	tmpDir, err := os.MkdirTemp("", "langlearner-test")
	if err != nil {
		t.Fatal(err)
	}
	dbPath := filepath.Join(tmpDir, "test.db")

	// 初始化数据库连接
	err = storage.InitDB(dbPath)
	if err != nil {
		t.Fatal(err)
	}

	// 自动迁移数据库表结构
	err = storage.DB.AutoMigrate(&types.Tag{})
	if err != nil {
		t.Fatal(err)
	}

	// 返回清理函数
	return func() {
		// 关闭数据库连接
		db, err := storage.DB.DB()
		if err == nil {
			db.Close()
		}
		// 删除临时数据库文件
		//os.RemoveAll(tmpDir)
	}
}

func TestListWithSQLite(t *testing.T) {
	// 设置测试数据库
	cleanup := setupTestDB(t)
	defer cleanup()

	// 创建服务实例
	service := &TagServiceImpl{
		storage: storage.NewSQLiteTagStorage(),
	}
	service.Start(context.Background())

	tests := []struct {
		name     string
		setup    func()
		page     int
		pageSize int
		keyword  string
		expected *types.TagList
		expErr   error
	}{
		{
			name:     "hasNoData",
			setup:    func() { storage.DB.Exec("DELETE FROM tags") },
			page:     1,
			pageSize: 2,
			keyword:  "",
			expected: &types.TagList{
				Total:       0,
				TotalPages:  0,
				CurrentPage: 1,
				PageSize:    2,
				Data:        []types.Tag{},
			},
			expErr: nil,
		},
		{
			name: "success with no keyword",
			setup: func() {
				storage.DB.Exec("DELETE FROM tags")
				storage.DB.Create(&types.Tag{Name: "tag1"})
				storage.DB.Create(&types.Tag{Name: "tag2"})
			},
			page:     1,
			pageSize: 2,
			keyword:  "",
			expected: &types.TagList{
				Total:       2,
				TotalPages:  1,
				CurrentPage: 1,
				PageSize:    2,
				Data: []types.Tag{
					{ID: 1, Name: "tag1"},
					{ID: 2, Name: "tag2"},
				},
			},
			expErr: nil,
		},
		{
			name: "success with keyword",
			setup: func() {
				storage.DB.Exec("DELETE FROM tags")
				storage.DB.Create(&types.Tag{Name: "tag1"})
				storage.DB.Create(&types.Tag{Name: "tag2"})
			},
			page:     1,
			pageSize: 2,
			keyword:  "tag1",
			expected: &types.TagList{
				Total:       1,
				TotalPages:  1,
				CurrentPage: 1,
				PageSize:    2,
				Data: []types.Tag{
					{ID: 1, Name: "tag1"},
				},
			},
			expErr: nil,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			// 设置测试数据
			tt.setup()

			// 执行测试
			result := service.List(tt.page, tt.pageSize, tt.keyword)

			// 验证结果
			if result.Success != 1 {
				assert.Equal(t, tt.expErr.Error(), result.Msg)
			} else {
				log.Println(result.Data)
			}
		})
	}
}

func TestCreateWithSQLite(t *testing.T) {
	// 设置测试数据库
	cleanup := setupTestDB(t)
	defer cleanup()

	// 创建服务实例
	service := &TagServiceImpl{
		storage: storage.NewSQLiteTagStorage(),
	}
	service.Start(context.Background())

	tests := []struct {
		name     string
		setup    func()
		tagName  string
		expected *types.Tag
		expErr   error
	}{
		{
			name:    "success",
			setup:   func() { storage.DB.Exec("DELETE FROM tags") },
			tagName: "newtag",
			expected: &types.Tag{
				ID:   1,
				Name: "newtag",
			},
			expErr: nil,
		},
		{
			name:     "empty name",
			setup:    func() { storage.DB.Exec("DELETE FROM tags") },
			tagName:  "",
			expected: nil,
			expErr:   errors.New("tag name cannot be empty"),
		},
		{
			name: "duplicate name",
			setup: func() {
				storage.DB.Exec("DELETE FROM tags")
				storage.DB.Create(&types.Tag{Name: "newtag"})
			},
			tagName:  "newtag",
			expected: nil,
			expErr:   errors.New("UNIQUE constraint failed: tags.name"),
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			// 设置测试数据
			tt.setup()

			// 执行测试
			result := service.Create(tt.tagName)

			// 验证结果
			if result.Success != 1 {
				assert.Equal(t, tt.expErr.Error(), result.Msg)
			} else {
				log.Println(result.Data)
			}
		})
	}
}
