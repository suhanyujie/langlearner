package types

// Note represents a note entity
type Note struct {
	ID          int    `json:"id" gorm:"primaryKey"`
	Front       string `json:"front" gorm:"type:text;not null"`
	Back        string `json:"back" gorm:"type:text"`
	Category    string `json:"category" gorm:"type:varchar(100)"`
	Tags        []Tag  `json:"tags" gorm:"many2many:note_tags"`
	CreatedAt   int64  `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt   int64  `json:"updated_at" gorm:"autoUpdateTime"`
}

// TableName specifies the table name for Note model
func (Note) TableName() string {
	return "notes"
}

// NoteList represents a paginated list of notes
type NoteList struct {
	Total       int    `json:"total"`
	TotalPages  int    `json:"total_pages"`
	CurrentPage int    `json:"current_page"`
	PageSize    int    `json:"page_size"`
	Data        []Note `json:"data"`
}
