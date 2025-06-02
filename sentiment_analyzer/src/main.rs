use std::path::PathBuf;
use rust_bert::pipelines::sentiment::SentimentModel;
use rust_bert::RustBertError;
use hf_hub::api::sync::{Api, ApiBuilder};
use rust_bert::pipelines::common::{ModelResource, ModelType};
use rust_bert::pipelines::sequence_classification::{SequenceClassificationConfig, SequenceClassificationModel};
use rust_bert::resources::LocalResource;

fn main() -> Result<(), RustBertError> {
    std::env::set_var("RUSTBERT_CACHE", "C:\\MyRustBertCache");

    let model_resource = ModelResource::Torch(Box::new(LocalResource::from(PathBuf::from("D:\\projects\\mind-verse\\sentiment_analyzer\\.models\\models--bhadresh-savani--bert-base-go-emotion\\snapshots\\6ecebb2840243665ab089020504c52e086862848\\pytorch_model.bin"))));

    let config_resource = Box::new(LocalResource::from(PathBuf::from(
        "D:\\projects\\mind-verse\\sentiment_analyzer\\.models\\models--bhadresh-savani--bert-base-go-emotion\\snapshots\\6ecebb2840243665ab089020504c52e086862848\\config.json"
    )));

    let vocab_resource = Box::new(LocalResource::from(PathBuf::from(
        "D:\\projects\\mind-verse\\sentiment_analyzer\\.models\\models--bhadresh-savani--bert-base-go-emotion\\snapshots\\6ecebb2840243665ab089020504c52e086862848\\vocab.txt"
    )));


    let config = SequenceClassificationConfig {
        model_type: ModelType::Bert,
        model_resource,
        config_resource,
        vocab_resource,
        lower_case: true,
        ..Default::default()
    };

    println!("Successfully created config");

    let model = SequenceClassificationModel::new(config)?;
    let input = ["I feel like nobody understands me, and everything is too much."];

    let output = model.predict(&input);
    println!("{:#?}", output);

    Ok(())
}
