package main

import (
	"errors"
	// "example/hello/pages/index"
	"fmt"
	"io"
	"net/http"
	"os"

	"github.com/patdx/worker-experiments/packages/http-test-go/pages/index"
)

func getRoot(w http.ResponseWriter, r *http.Request) {
	fmt.Printf("got / request\n")

	data := index.TodoPageData{
		PageTitle: "My TODO list",
		Todos: []index.ITodo{
			{Title: "Task 2", Done: false},
			{Title: "Task 2", Done: true},
			{Title: "Task 3", Done: true},
		},
	}

	w.Write([]byte(index.Page(data)()))

}
func getHello(w http.ResponseWriter, r *http.Request) {
	fmt.Printf("got /hello request\n")
	io.WriteString(w, "Hello, HTTP!\n")
}

func main() {
	http.HandleFunc("/", getRoot)
	http.HandleFunc("/hello", getHello)

	fmt.Println("Listening on http://localhost:3333")
	err := http.ListenAndServe(":3333", nil)

	if errors.Is(err, http.ErrServerClosed) {
		fmt.Printf("server closed\n")
	} else if err != nil {
		fmt.Printf("error starting server: %s\n", err)
		os.Exit(1)
	} else {
		fmt.Printf("started server http://localhost:3333\n")
	}
}
