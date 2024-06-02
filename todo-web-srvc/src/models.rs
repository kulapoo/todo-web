use std::sync::Arc;
use chrono::{DateTime, Local};
use serde_derive::{Deserialize, Serialize};
use tokio::sync::Mutex;

use uuid::Uuid;

/// So we don't have to tackle how different database work, we'll just use
/// a simple in-memory DB, a vector synchronized by a mutex.
pub type Db = Arc<Mutex<Vec<Task>>>;

pub fn blank_db() -> Db {
    Arc::new(Mutex::new(Vec::new()))
}

#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct Task {
    pub id: String,
    pub title: String,
    pub description: String,
    pub completed: bool,

    pub created_at: String,
    pub updated_at: String,
}

#[derive(Default, Clone)]
pub struct TaskBuilder {
    id: Option<String>,
    title: Option<String>,
    description: Option<String>,
    completed: bool,
    updated_at: Option<String>
}

impl TaskBuilder {
    pub fn new() -> Self {
        TaskBuilder::default()
    }

    pub fn id(mut self, id: &str) -> Self {
        self.id = Some(id.to_string());
        self
    }

    pub fn title(mut self, title: &str) -> Self {
        self.title = Some(title.to_string());
        self
    }

    pub fn description(mut self, description: &str) -> Self {
        self.description = Some(description.to_string());
        self
    }

    pub fn completed(mut self, completed: bool) -> Self {
        self.completed = completed;
        self
    }
    pub fn updated_at(mut self, updated_at: &str) -> Self {
        self.updated_at = Some(updated_at.to_string());
        self
    }

    pub fn build(self) -> Task {
        let local_now: DateTime<Local> = Local::now();
        let now = local_now.to_rfc3339();

        Task {
            id: self.id.unwrap_or_else(|| Uuid::new_v4().to_string()),
            title: self.title.unwrap_or_else(|| "".to_string()),
            description: self.description.unwrap_or_else(|| "".to_string()),
            completed: self.completed,
            created_at: now.clone(),
            updated_at: self.updated_at.unwrap_or_else(|| now.clone())
        }
    }
}

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct TaskDto {
    pub id: Option<String>,
    pub title: String,
    pub description: Option<String>,
    pub completed: bool,
    pub updated_at: Option<String>
}

// The query parameters for list_todos.
#[derive(Debug, Deserialize)]
pub struct ListOptions {
    pub offset: Option<usize>,
    pub limit: Option<usize>,
}