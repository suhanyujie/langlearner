package types

// Tag represents a tag entity
type Tag struct {
	ID   int    `json:"id" gorm:"primaryKey"`
	Name string `json:"name" gorm:"uniqueIndex;not null"`
}

// TableName specifies the table name for Tag model
func (Tag) TableName() string {
	return "tags"
}

// TagList represents a paginated list of tags
type TagList struct {
	Total       int   `json:"total"`
	TotalPages  int   `json:"total_pages"`
	CurrentPage int   `json:"current_page"`
	PageSize    int   `json:"page_size"`
	Data        []Tag `json:"data"`
}

// TagService defines the interface for tag operations
type TagService interface {
	// List returns a paginated list of tags
	List(page, pageSize int, keyword string) (*TagList, error)
	// Create creates a new tag
	Create(name string) (*Tag, error)
	// Update updates an existing tag
	Update(id int, name string) (*Tag, error)
	// Delete deletes a tag
	Delete(id int) error
}
