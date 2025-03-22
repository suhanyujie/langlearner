package services

import (
	"context"
	"errors"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"langlearner1/backend/types"
)

// MockTagStorage is a mock implementation of TagStorage interface
type MockTagStorage struct {
	mock.Mock
}

func (m *MockTagStorage) List(id int, keyword string, offset int, limit int) ([]types.Tag, error) {
	args := m.Called(id, keyword, offset, limit)
	return args.Get(0).([]types.Tag), args.Error(1)
}

func (m *MockTagStorage) Create(tag *types.Tag) error {
	args := m.Called(tag)
	return args.Error(0)
}

func (m *MockTagStorage) Update(tag *types.Tag) error {
	args := m.Called(tag)
	return args.Error(0)
}

func (m *MockTagStorage) Delete(id int) error {
	args := m.Called(id)
	return args.Error(0)
}

func TestList(t *testing.T) {
	mockStorage := new(MockTagStorage)
	service := &TagServiceImpl{
		storage: mockStorage,
	}
	service.Start(context.Background())

	tests := []struct {
		name     string
		page     int
		pageSize int
		keyword  string
		mockTags []types.Tag
		mockErr  error
		expected *types.TagList
		expErr   error
	}{
		{
			name:     "hasNoData",
			page:     1,
			pageSize: 2,
			keyword:  "",
			mockTags: nil,
			mockErr:  nil,
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
			name:     "success with no keyword",
			page:     1,
			pageSize: 2,
			keyword:  "",
			mockTags: []types.Tag{
				{ID: 1, Name: "tag1"},
				{ID: 2, Name: "tag2"},
			},
			mockErr: nil,
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
			name:     "success with keyword",
			page:     1,
			pageSize: 2,
			keyword:  "tag1",
			mockTags: []types.Tag{
				{ID: 1, Name: "tag1"},
				{ID: 2, Name: "tag2"},
			},
			mockErr: nil,
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
			mockStorage.On("List", 0, tt.keyword, (tt.page-1)*tt.pageSize, tt.pageSize).Return(tt.mockTags, tt.mockErr)
			result, err := service.List(tt.page, tt.pageSize, tt.keyword)

			if err != nil {
				assert.Error(t, err)
				assert.Equal(t, tt.expErr.Error(), err.Error())
			} else {
				assert.NoError(t, err)
				assert.Equal(t, tt.expected, result)
			}
			mockStorage.AssertExpectations(t)
		})
	}
}

func TestCreate(t *testing.T) {
	mockStorage := new(MockTagStorage)
	service := &TagServiceImpl{
		storage: mockStorage,
	}
	service.Start(context.Background())

	tests := []struct {
		name     string
		tagName  string
		mockErr  error
		expected *types.Tag
		expErr   error
	}{
		{
			name:    "success",
			tagName: "newtag",
			mockErr: nil,
			expected: &types.Tag{
				Name: "newtag",
			},
			expErr: nil,
		},
		{
			name:     "empty name",
			tagName:  "",
			mockErr:  nil,
			expected: nil,
			expErr:   errors.New("tag name cannot be empty"),
		},
		{
			name:     "storage error",
			tagName:  "newtag",
			mockErr:  errors.New("storage error"),
			expected: nil,
			expErr:   errors.New("storage error"),
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if tt.tagName != "" {
				tmpData := &types.Tag{Name: tt.tagName}
				mockStorage.On("Create", tmpData).Return(tt.mockErr)
			}

			result, err := service.Create(tt.tagName)

			if err != nil {
				assert.Error(t, err)
				assert.Equal(t, tt.expErr.Error(), err.Error())
			} else {
				assert.NoError(t, err)
				assert.Equal(t, tt.expected, result)
			}
			mockStorage.AssertExpectations(t)
		})
	}
}
