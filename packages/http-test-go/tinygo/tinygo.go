package tinygo

import (
	"github.com/patdx/worker-experiments/packages/http-test-go/pages/index"
	// "example/hello/pages/index"
)

func main() {
	data := index.TodoPageData{
		PageTitle: "My TODO list",
		Todos: []index.ITodo{
			{Title: "Task 2", Done: false},
			{Title: "Task 2", Done: true},
			{Title: "Task 3", Done: true},
		},
	}

	println(index.Page(data)())
}
