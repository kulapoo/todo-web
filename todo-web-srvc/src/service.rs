use crate::models::TaskBuilder;

use super::models::{Db, ListOptions, Task, TaskDto};
use std::convert::Infallible;
use chrono::{DateTime, Local};
use warp::http::StatusCode;

pub async fn list_todos(opts: ListOptions, db: Db) -> Result<impl warp::Reply, Infallible> {
    // Just return a JSON array of todos, applying the limit and offset.
    let todos = db.lock().await;
    let todos: Vec<Task> = todos
        .clone()
        .into_iter()
        .skip(opts.offset.unwrap_or(0))
        .take(opts.limit.unwrap_or(std::usize::MAX))
        .collect();
    Ok(warp::reply::json(&todos))
}

pub async fn create_todo(create: TaskDto, db: Db) -> Result<impl warp::Reply, Infallible> {
    log::debug!("create_todo: {:?}", create);

    let mut vec = db.lock().await;

    let new_task = TaskBuilder::new()
        .title(&create.title)
        .description(&create.description.unwrap_or_else(|| "".to_string()))
        .completed(create.completed)
        .build();


    // No existing Todo with id, so insert and return `201 Created`.
    vec.push(new_task.clone());

    Ok(warp::reply::with_status(warp::reply::json(&new_task), StatusCode::OK))
}

pub async fn update_todo(
    id: String,
    update: TaskDto,
    db: Db,
) -> Result<impl warp::Reply, Infallible> {
    log::debug!("update_todo: id={}, todo={:?}", id, update);
    let mut vec = db.lock().await;

    let local_now: DateTime<Local> = Local::now();
    let now = local_now.to_rfc3339();
    let updated_task = TaskBuilder::new()
        .id(&id)
        .title(&update.title)
        .description(&update.description.unwrap_or_else(|| "".to_string()))
        .completed(update.completed)
        .updated_at(&now.to_string())
        .build();

    // Look for the specified Todo...
    for todo in vec.iter_mut() {
        if todo.id == id {
            *todo = updated_task.clone();
            return Ok(warp::reply::with_status(warp::reply::json(&updated_task), StatusCode::OK));
        }
    }

    log::debug!("    -> todo id not found!");

    // If the for loop didn't return OK, then the ID doesn't exist...
    Ok(warp::reply::with_status(warp::reply::json(&serde_json::json!({})), StatusCode::OK))
}

pub async fn delete_todo(id: String, db: Db) -> Result<impl warp::Reply, Infallible> {
    log::debug!("delete_todo: id={}", id);

    let mut vec = db.lock().await;

    let len = vec.len();
    vec.retain(|todo| {
        // Retain all Todos that aren't this id...
        // In other words, remove all that *are* this id...
        todo.id != id
    });

    // If the vec is smaller, we found and deleted a Todo!
    let deleted = vec.len() != len;

    if deleted {
        // respond with a `204 No Content`, which means successful,
        // yet no body expected...
        Ok(StatusCode::NO_CONTENT)
    } else {
        log::debug!("    -> todo id not found!");
        Ok(StatusCode::NOT_FOUND)
    }
}

pub async fn mark_completed(id: String, db: Db) -> Result<impl warp::Reply, Infallible> {
    log::debug!("mark_done: id={}", id);

    let mut vec = db.lock().await;

    let todo = vec.iter_mut().find(|todo| todo.id == id);

    if let Some(todo) = todo {
        todo.completed = true;
        todo.updated_at = Local::now().to_rfc3339();
        Ok(StatusCode::OK)
    } else {
        log::debug!("    -> todo id not found!");
        Ok(StatusCode::NOT_FOUND)
    }
}