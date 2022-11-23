package index

import (
	. "github.com/stevelacy/daz"
)

func Fragment(children ...HTML) HTML {
	return func() string {
		res := ""
		for _, v := range children {
			res += v()
		}
		return res
	}
}

func Raw(str string) HTML {
	return func() string {
		return str
	}
}

// func getFuncs() (HTML, HTML) {
// 	return H("hi"), H("hello")
// }

// var h, y = getFuncs()

func Map[T any](ts []T, cb func(T) HTML) []HTML {

	var nodes []HTML
	for _, t := range ts {
		nodes = append(nodes, cb(t))
	}
	return nodes
}

func Page(data TodoPageData) HTML {
	return Fragment(
		Raw("<!doctype html>"),
		H("html",
			H("head",
				H("meta", Attr{"charset": "utf-8"}),
				H("meta", Attr{
					"name":    "viewport",
					"content": "width=device-width, initial-scale=1"}),
			),
			H("body",
				H("h1", data.PageTitle),
				H("ul",
					Map(data.Todos, Todo),
				),
			),
		),
	)
}

type ITodo struct {
	Title string
	Done  bool
}

type TodoPageData struct {
	PageTitle string
	Todos     []ITodo
}

func Todo(todo ITodo) HTML {
	if todo.Done {
		return H(
			"li",
			Attr{
				"class": "done",
			},
			todo.Title)

	} else {
		return H("li", todo.Title)
	}
}
