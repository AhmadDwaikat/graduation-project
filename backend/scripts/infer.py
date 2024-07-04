from flask import Flask, request, jsonify
import pandas as pd
import pickle
from sklearn.metrics.pairwise import cosine_similarity
from pymongo import MongoClient
import os
from dotenv import load_dotenv

app = Flask(__name__)

# Load environment variables
load_dotenv(os.path.join(os.path.dirname(__file__), '../.env'))

# Database connection
client = MongoClient(os.getenv("MONGO_URI"))
db = client["eventsDB"]

# Load the TF-IDF vectorizer and matrix from disk
with open(os.path.join(os.path.dirname(__file__), '../backend/recommendation/tfidf_vectorizer.pkl'), 'rb') as f:
    tfidf_vectorizer = pickle.load(f)
with open(os.path.join(os.path.dirname(__file__), '../backend/recommendation/tfidf_matrix.pkl'), 'rb') as f:
    tfidf_matrix = pickle.load(f)

@app.route('/recommend', methods=['POST'])
def recommend():
    user_data = request.json
    user_id = user_data['user_id']

    # Fetch user interests
    user_interests = db.users.find_one({'_id': user_id}, {'interests': 1})['interests']

    # Combine interests into a single string for the user
    user_content = ' '.join(user_interests)

    user_tfidf = tfidf_vectorizer.transform([user_content])
    cosine_similarities = cosine_similarity(user_tfidf, tfidf_matrix)
    top_n_indices = cosine_similarities[0].argsort()[-3:][::-1]

    # Fetch event data from MongoDB using indices
    events = pd.DataFrame(list(db.events.find()))
    recommended_events = events.iloc[top_n_indices]

    response = recommended_events[['event_id', 'event_type', 'category', 'availability']].to_dict(orient='records')
    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True)
