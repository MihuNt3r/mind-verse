use reqwest::Client;
use serde::{Deserialize, Serialize};
use sqlx::{postgres::PgPoolOptions, FromRow};
use std::env;

#[derive(Serialize)]
struct RequestBody {
    text: String,
}

#[derive(Serialize, Deserialize, Debug)]
struct EmotionScore {
    label: String,
    score: f32,
}

#[derive(Debug, FromRow)]
struct Quote {
    id: i32,
    quote: String,
    category: String,
    author: Option<String>,
}

#[derive(Deserialize, Debug)]
struct ApiResponse {
    results: Vec<EmotionScore>,
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    dotenvy::dotenv().ok();
    let db_url = env::var("DATABASE_URL")?;
    let pool = PgPoolOptions::new()
        .max_connections(5)
        .connect(&db_url)
        .await?;

    let client = Client::new();
    // fetch quotes one by one
    let quotes: Vec<Quote> = sqlx::query_as::<_, Quote>(//433281
        "SELECT id, quote, category, author FROM csv_imported_quotes WHERE quote IS NOT NULL OFFSET 433281",
    )
        .fetch_all(&pool)
        .await?;

    for quote in quotes {
        let request = RequestBody {
            text: quote.quote.clone(),
        };

        let res = client
            .post("http://localhost:8000/classify")
            .json(&request)
            .send()
            .await?;

        if res.status().is_success() {
            let response_data: ApiResponse = res.json().await?;

            let emotions_json = serde_json::to_value(response_data.results)?;

            sqlx::query!(
                r#"
                INSERT INTO processed_quotes (quote, author, category, emotion_scores)
                VALUES ($1, $2, $3, $4)
                "#,
                quote.quote,
                quote.author,
                quote.category,
                emotions_json
            )
                .execute(&pool)
                .await?;

            println!("Quote with id {} is processed", quote.id);
        } else {
            eprintln!("Failed to classify quote {}: {}", quote.id, res.status());
        }
    }

    // let res = client
    //     .post("http://localhost:8000/classify")
    //     .json(&request)
    //     .send()
    //     .await?;
    //
    // let response_data: ApiResponse = res.json().await?;
    // println!("{:#?}", response_data);

    Ok(())
}
