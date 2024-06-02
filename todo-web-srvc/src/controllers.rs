use warp::Filter;

use crate::service;
use crate::models::{Db, ListOptions, TaskDto};

// create "tasks" constant for path
const TASKS: &str = "tasks";

/// The 4 TODOs filters combined.
pub fn todos(
    db: Db,
) -> impl Filter<Extract = (impl warp::Reply,), Error = warp::Rejection> + Clone {
    todos_list(db.clone())
        .or(todos_create(db.clone()))
        .or(todos_update(db.clone()))
        .or(todos_mark_completed(db.clone()))
        .or(todos_delete(db))
}
/// GET /todos?offset=  v.3&limit=5
pub fn todos_list(
    db: Db,
) -> impl Filter<Extract = (impl warp::Reply,), Error = warp::Rejection> + Clone {
    warp::path(TASKS)
        .and(warp::path::end())
        .and(warp::get())
        .and(warp::query::<ListOptions>())
        .and(with_db(db))
        .and_then(service::list_todos)
}

/// POST /todos with JSON body
pub fn todos_create(
    db: Db,
) -> impl Filter<Extract = (impl warp::Reply,), Error = warp::Rejection> + Clone {
    warp::path(TASKS)
        .and(warp::path::end())
        .and(warp::post())
        .and(json_body())
        .and(with_db(db))
        .and_then(service::create_todo)
}

/// PUT /todos/:id with JSON body
pub fn todos_update(
    db: Db,
) -> impl Filter<Extract = (impl warp::Reply,), Error = warp::Rejection> + Clone {

    warp::path(TASKS)
        .and(warp::path::param())
        .and(warp::path::end())
        .and(warp::put())
        .and(json_body())
        .and(with_db(db))
        .and_then(service::update_todo)
}

/// DELETE /todos/:id
pub fn todos_delete(
    db: Db,
) -> impl Filter<Extract = (impl warp::Reply,), Error = warp::Rejection> + Clone {
    // We'll make one of our endpoints admin-only to show how authentication filters are used
    let admin_only = warp::header::exact("Authorization", "Bearer admin");

    warp::path(TASKS)
        .and(warp::path::param())
        .and(warp::path::end())
        // It is important to put the auth check _after_ the path filters.
        // If we put the auth check before, the request `PUT /todos/invalid-string`
        // would try this filter and reject because the authorization header doesn't match,
        // rather because the param is wrong for that other path.
        .and(admin_only)
        .and(warp::delete())
        .and(with_db(db))
        .and_then(service::delete_todo)
}

/// PATCH /todos/:id/completed
pub fn todos_mark_completed(
    db: Db,
) -> impl Filter<Extract = (impl warp::Reply,), Error = warp::Rejection> + Clone {
    let admin_only = warp::header::exact("Authorization", "Bearer admin");
    warp::path(TASKS)
        .and(warp::path::param())
        .and(warp::path("completed"))
        .and(warp::path::end())
        .and(admin_only)
        .and(warp::patch())
        .and(with_db(db))
        .and_then(service::mark_completed)
}

fn with_db(db: Db) -> impl Filter<Extract = (Db,), Error = std::convert::Infallible> + Clone {
    warp::any().map(move || db.clone())
}

fn json_body() -> impl Filter<Extract = (TaskDto,), Error = warp::Rejection> + Clone {
    // When accepting a body, we want a JSON body
    // (and to reject huge payloads)...
    warp::body::content_length_limit(1024 * 16).and(warp::body::json())
}