import pandas as pd
from pymongo import MongoClient
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv(os.path.join(os.path.dirname(__file__), '../../.env'))

# Database connection
client = MongoClient(os.getenv("MONGO_URI"))
db = client["eventsDB"]

# Load data from Excel files
users_df = pd.read_excel(os.path.join(os.path.dirname(__file__), '../../data/generated_users.xlsx'))
events_df = pd.read_excel(os.path.join(os.path.dirname(__file__), '../../data/generated_events_with_five_star_ratings.xlsx'))

# Convert dataframes to dictionary format
users_data = users_df.to_dict(orient='records')
events_data = events_df.to_dict(orient='records')

# Insert data into MongoDB
db.users.insert_many(users_data)
db.events.insert_many(events_data)

print("Data loaded successfully.")
