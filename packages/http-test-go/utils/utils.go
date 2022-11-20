package utils

import (
	"io"

	g "github.com/maragudk/gomponents"
	c "github.com/maragudk/gomponents/components"
	h "github.com/maragudk/gomponents/html"
)

// var H = g.El

type Attr map[string]string

func H(name string,  children ...interface{}) Node {
	var nodes []g.Node

	for _, value := range children {
		switch value.(type) {
		case Attr:
			for key, value := range value as Attr {
				nodes = append(nodes, g.Attr(key, value))
			}
		}
	}

	for key, value := range attr {
		nodes = append(nodes, g.Attr(key, value))
	}

	nodes = append(nodes, children...)

	return g.El(name, nodes...)

}

var Text = g.Text

var HTML5 = c.HTML5

// var Attr = g.Attr

var Raw = g.Raw

type Node = g.Node

func Map[T any](ts []T, cb func(T) g.Node) []g.Node {
	var nodes []g.Node
	for _, t := range ts {
		nodes = append(nodes, cb(t))
	}
	return nodes
}

var Class = h.Class

func Fragment(children ...Node) Node {
	return g.NodeFunc(func(w io.Writer) error {

		for _, c := range children {
			err := c.Render(w)

			if err != nil {
				return err
			}
		}

		return nil
	})
}
