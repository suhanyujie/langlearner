package types

// Tag represents a tag entity
type Tag struct {
	ID   int    `json:"id" gorm:"primaryKey"`
	Name string `json:"name" gorm:"type:varchar(100);uniqueIndex;not null"`
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

// TagServiceIf defines the interface for tag operations
type TagServiceIf interface {
	// List returns a paginated list of tags
	List(page, pageSize int, keyword string) JSResp
	// Create creates a new tag
	Create(name string) JSResp
	// Update updates an existing tag
	Update(id int, name string) JSResp
	// Delete deletes a tag
	Delete(id int) JSResp
}

// NoteServiceIf defines the interface for tag operations
type NoteServiceIf interface {
	// List returns a paginated list of tags
	List(page, pageSize int, keyword string) JSResp
	// Create creates a new tag
	Create(name string) JSResp
	// Update updates an existing tag
	Update(id int, frontCont, backCont string) JSResp
	// Delete deletes a tag
	Delete(id int) JSResp
}
