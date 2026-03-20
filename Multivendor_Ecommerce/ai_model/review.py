import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification

model_path = "bert-base-uncased"

tokenizer = AutoTokenizer.from_pretrained(model_path)
model = AutoModelForSequenceClassification.from_pretrained(model_path)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)
model.eval()


def predict_review(text):

    inputs = tokenizer(
        text,
        return_tensors="pt",
        truncation=True,
        padding=True,
        max_length=128
    )

    inputs = {k: v.to(device) for k, v in inputs.items()}

    with torch.no_grad():
        outputs = model(**inputs)

    prediction = torch.argmax(outputs.logits, dim=1).item()

    if prediction == 0:
        return "Fake Review (CG)"
    else:
        return "Genuine Review (OR)"


print(predict_review("This product is amazing and worth every penny"))
print(predict_review("Best product ever!!! Buy now!!!"))