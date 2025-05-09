# -*- coding: utf-8 -*-
"""model2.ipynb

Automatically generated by Colab.

Original file is located at
    https://colab.research.google.com/drive/1_rZ4eXf6yUAsTu_nPIfFaLvs4dypwcwe
"""

!pip install -q datasets transformers peft accelerate trl

!pip install --upgrade fsspec==2024.12.0 gcsfs==2024.12.0

from google.colab import drive
drive.mount('/content/drive')
# Replace with the actual path to your JSON file in Google Drive
gdrive_json_path = '/content/drive/MyDrive/llm_chatbot/women_jobs_chatbot_data.json'

import json
from datasets import Dataset

try:
    with open(gdrive_json_path, 'r') as f:
        data = json.load(f)
    dataset = Dataset.from_list(data)
    print(f"✅ Dataset loaded with {len(dataset)} samples from Google Drive.")
    print(f"Sample dataset entry:\n{dataset[0]}")
except FileNotFoundError:
    print(f"❌ Error: JSON file not found at '{gdrive_json_path}'. Please check the path.")
    exit()
except json.JSONDecodeError:
    print(f"❌ Error: Could not decode JSON from '{gdrive_json_path}'. Please ensure it's a valid JSON file.")
    exit()

!pip install -U bitsandbytes
!pip install -U accelerate
!pip install -U transformers
!pip install -U peft

from transformers import AutoTokenizer, AutoModelForSeq2SeqLM, TrainingArguments, Seq2SeqTrainer, DataCollatorForSeq2Seq
from peft import get_peft_model, LoraConfig, TaskType

model_id = "google/flan-t5-base"

tokenizer = AutoTokenizer.from_pretrained(model_id)
base_model = AutoModelForSeq2SeqLM.from_pretrained(model_id)

# Apply LoRA for efficient fine-tuning
peft_config = LoraConfig(
    r=8,
    lora_alpha=32,
    target_modules=["q", "v"],
    lora_dropout=0.1,
    bias="none",
    task_type=TaskType.SEQ_2_SEQ_LM,
)
model = get_peft_model(base_model, peft_config)
model.print_trainable_parameters()

print("--- Inspecting Dataset ---")
print(dataset)
print(dataset[0])

def preprocess(example):
    instruction = example["instruction"].strip()
    output = example["output"].strip()

    # Optional: Add custom prompt formatting
    example["instruction"] = f"Instruction: {instruction}"
    example["output"] = f"Response: {output}"

    return example

# Apply before tokenizing
cleaned_dataset = dataset.map(preprocess)

max_input_len = 512
max_target_len = 128

def tokenize(example):
    input_enc = tokenizer(example['instruction'], padding="max_length", truncation=True, max_length=max_input_len)
    target_enc = tokenizer(example['output'], padding="max_length", truncation=True, max_length=max_target_len)
    input_enc["labels"] = target_enc["input_ids"]
    return input_enc

tokenized_dataset = dataset.map(tokenize, remove_columns=["instruction", "output"])

from transformers import AutoModelForSeq2SeqLM, TrainingArguments, Trainer
from peft import LoraConfig, get_peft_model, TaskType

model = AutoModelForSeq2SeqLM.from_pretrained("google/flan-t5-base")

# Configure LoRA
lora_config = LoraConfig(
    r=8,                # rank
    lora_alpha=32,
    target_modules=["q", "v"],  # for T5, use q and v projection layers
    lora_dropout=0.1,
    bias="none",
    task_type=TaskType.SEQ_2_SEQ_LM
)

model = get_peft_model(model, lora_config)
model.print_trainable_parameters()

training_args = TrainingArguments(
    output_dir="./flan-t5-lora-model",
    per_device_train_batch_size=4,
    num_train_epochs=3,
    logging_dir="./logs",
    logging_steps=10,
    save_total_limit=1,
    save_steps=100,
    report_to="none",
    label_names=["labels"]  # 👈 Add this line
)


trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=tokenized_dataset,
    tokenizer=tokenizer
)

trainer.train()

import re
import torch
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM

!pip install google-generativeai

import os
import google.generativeai as genai

# Paste your API key here
GOOGLE_API_KEY = "AIzaSyDXAjTz4OO0lCIST-XXlw6sdxFoSqsWZ7I"

# Configure the API
genai.configure(api_key=GOOGLE_API_KEY)

model_path = "/content/flan-t5-lora-model/checkpoint-3522"  # ← update this if needed
tokenizer = AutoTokenizer.from_pretrained(model_path)
model = AutoModelForSeq2SeqLM.from_pretrained(model_path)

def format_input(user_query):
    return f"""You are a helpful assistant that answers career-related questions for women. Respond in a warm, clear, and informative tone. Be concise but human.

User: {user_query}
Assistant:"""

import requests

def gemini_fallback(prompt):
    try:
        url = f"https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key={GOOGLE_API_KEY}"
        headers = {"Content-Type": "application/json"}
        data = {
            "contents": [{
                "role": "user",
                "parts": [{"text": prompt}]
            }]
        }

        response = requests.post(url, headers=headers, json=data)

        if response.status_code == 200:
            res_json = response.json()
            return res_json['candidates'][0]['content']['parts'][0]['text']
        else:
            return f"⚠️ Gemini Fallback Error: {response.status_code} {response.text}"
    except Exception as e:
        return f"⚠️ Gemini Fallback Error: {str(e)}"

import re

def clean_response(text):
    text = text.strip()

    # Check for repetition
    words = text.lower().split()
    if len(set(words)) < 5 or any(words.count(w) > 5 for w in set(words)):
        return "⚠️ The response seems repetitive or unclear. Try rephrasing the question."

    # Fix case and formatting
    text = re.sub(r"(^|\.\s+)([a-z])", lambda m: m.group(1) + m.group(2).upper(), text)

    # Replace raw tags with human language
    replacements = {
        "job title": "The job title is",
        "description": "The job description is",
        "location": "The job is located in",
        "key responsibility": "Key responsibilities include",
        "preferred skill qualification": "Preferred qualifications are"
    }
    for k, v in replacements.items():
        text = text.replace(k, v)

    if not text.endswith("."):
        text += "."

    return text

import re

def is_gibberish(text):
    words = text.split()
    gibberish_count = 0

    for word in words:
        if len(word) < 4 or not re.match("^[a-zA-Z]+$", word):
            gibberish_count += 1

    gibberish_ratio = gibberish_count / len(words) if words else 1
    return gibberish_ratio > 0.2  # Lower threshold for fallback

def is_too_short(text):
    return len(text.split()) < 15  # Must have at least 15 words

def has_common_words(text):
    common_keywords = ["job", "skills", "role", "responsibility", "experience", "intern"]
    return any(word in text.lower() for word in common_keywords)

def smart_response(user_input):
    try:
        output = generate_response(user_input)
        cleaned = clean_output(output)

        # Super strict fallback triggers
        if (
            is_gibberish(cleaned)
            or is_too_short(cleaned)
            or "⚠️" in cleaned
            or not has_common_words(cleaned)
            or "python python python" in cleaned.lower()
            or cleaned.strip() == ""
            or cleaned.strip().isdigit()
            or len(set(cleaned.lower().split())) < 7  # Low unique word variety
        ):
            raise ValueError("Fallback triggered: Not good enough.")

        return f"🧠 Flan-T5 Response:\n{cleaned}"

    except Exception as e:
        gemini_answer = gemini_fallback(user_input)
        return f"Response:\n{gemini_answer}"

query = "Tell me about the job: Robotics Research Intern"
print(smart_response(query))