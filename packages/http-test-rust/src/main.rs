use salvo::prelude::*;

#[handler]
async fn hello_world(res: &mut Response) {
  use stpl::html::*;
  let content = (
    h1.class("main")("Welcome page"),
    p(format!("Hi, {}!", "x")),
    ul((0..2).map(|n| li(n)).collect::<Vec<_>>()),
  );
  res.render(Text::Html(content.renderto_string()))
}

#[tokio::main]
async fn main() {
  let router = Router::new().get(hello_world);
  Server::new(TcpListener::bind("127.0.0.1:7878"))
    .serve(router)
    .await;
}
