import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import json

# Load the datasets
users = pd.read_excel('C:\\Ahmad\\NNU\\graduation project\\generated_users.xlsx')
events = pd.read_excel('C:\\Ahmad\\NNU\\graduation project\\generated_events.xlsx')

# Combine all text data for TF-IDF vectorization
all_texts = users['interests'].tolist() + events['category'].tolist()

# Create a TF-IDF vectorizer and fit it on the combined texts
vectorizer = TfidfVectorizer()
vectorizer.fit(all_texts)

# Transform user interests and event descriptions to TF-IDF vectors
user_vectors = vectorizer.transform(users['interests'].tolist())
event_vectors = vectorizer.transform(events['category'].tolist())

# Calculate cosine similarities between each user and each event
similarities = cosine_similarity(user_vectors, event_vectors)

# Save the vectorizer and similarities to JSON files
vectorizer_json = vectorizer.get_feature_names_out().tolist()
similarities_list = similarities.tolist()

with open('../models/vectorizer.json', 'w') as f:
    json.dump(vectorizer_json, f)

with open('../models/similarities.json', 'w') as f:
    json.dump(similarities_list, f)

print("Training complete and JSON files created.")
