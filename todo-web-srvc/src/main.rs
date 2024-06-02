use std::env;

use todo_web_srvc::{controllers, models};
use warp::{Filter, http::Method};

#[tokio::main]
async fn main() {
    if env::var_os("RUST_LOG").is_none() {
        // Set `RUST_LOG=todos=debug` to see debug logs,
        // this only shows access logs.
        env::set_var("RUST_LOG", "todos=info");
    }
    pretty_env_logger::init();

    let db = models::blank_db();

    let api = controllers::todos(db);

    let cors = warp::cors()
        .allow_any_origin()
        .allow_methods(&[
            Method::GET,
            Method::POST,
            Method::DELETE,
            Method::PUT,
            Method::PATCH,
            Method::OPTIONS
        ])
        .allow_headers(vec!["content-type", "Authorization"]);

    // View access logs by setting `RUST_LOG=todos`.
    let routes = api.with(warp::log("todos")).with(cors);
    // Start up the server...
    warp::serve(routes).run(([127, 0, 0, 1], 3030)).await;
}