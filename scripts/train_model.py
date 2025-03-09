import os
import json
from transformers import AutoTokenizer, AutoModelForCausalLM, TrainingArguments, Trainer
from datasets import load_dataset

def load_config():
    with open('../configs/huggingface_config.json', 'r') as f:
        return json.load(f)

def load_model_and_tokenizer(config):
    model = AutoModelForCausalLM.from_pretrained(config['model_repo'])
    tokenizer = AutoTokenizer.from_pretrained(config['model_repo'])
    return model, tokenizer

def load_dataset(config):
    return load_dataset(config['dataset_repo'])

def main():
    config = load_config()
    model, tokenizer = load_model_and_tokenizer(config)
    dataset = load_dataset(config)

    training_args = TrainingArguments(
        output_dir="./results",
        num_train_epochs=3,
        per_device_train_batch_size=8,
        per_device_eval_batch_size=8,
        warmup_steps=500,
        weight_decay=0.01,
        logging_dir='./logs',
    )

    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=dataset["train"],
        eval_dataset=dataset["validation"],
    )

    trainer.train()
    trainer.save_model()

if __name__ == "__main__":
    main()

