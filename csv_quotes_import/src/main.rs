use tokio_postgres::{NoTls, Error};
use csv::ReaderBuilder;
use std::fs::File;
use std::env;
use dotenv::dotenv;

#[tokio::main]
async fn main() -> Result<(), Error> {
    dotenv().ok();
    let db_connection_string =
        env::var("DATABASE_URL")
            .expect("Connection string is not set");

    let (client, connection) = tokio_postgres::connect(
        &db_connection_string,
        NoTls,
    ).await?;

    let handle = tokio::spawn(async move {
        if let Err(e) = connection.await {
            eprintln!("connection error: {}", e);
        } else {
            println!("Connection is successfull");
        }
        // Why client is working, but I don't see connection output in console???
        println!("amogus")
    });
    //
    //
    // // Now we can execute a simple statement that just returns its parameter.
    // let rows = client
    //     .query("SELECT $1::TEXT", &[&"hello world"])
    //     .await?;
    //
    // rows.into_iter().for_each(|row| println!("{:?}", row));
    //
    // handle.await.expect("HUY");

    let file = File::open("../quotes/quotes.csv").expect("Cannot open quotes.csv");
    let mut rdr = ReaderBuilder::new().from_reader(file);

    for result in rdr.records().into_iter() {
        let record = result.expect("Failed to read record");

        let quote = &record[0];
        let author = &record[1];
        let category = &record[2];

        // println!("{:?}", record);

        println!("{} - {} - {}", quote, author, category);

        client.execute(
            "INSERT INTO csv_imported_quotes (quote, author, category, isprocessed) VALUES ($1, $2, $3, false)",
            &[&quote, &author, &category],
        ).await?;
    }

    Ok(())
}
