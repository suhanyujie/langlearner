package types

type JSResp struct {
	Success int    `json:"success"` // 1:success;
	Msg     string `json:"msg"`
	Data    any    `json:"data,omitempty"`
}
