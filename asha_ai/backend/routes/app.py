from flask import Flask, request, jsonify
from serpapi import GoogleSearch
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Replace with your actual SerpAPI key
SERP_API_KEY = "4e416c8febcb1c2a68d57622025263c30949ba9fec57ac7a782933d2dfd17981"

def search_google_jobs(user_query, user_location):
    """
    Fetches job listings from Google Jobs using SerpAPI based on user input.
    Returns a list of jobs with basic details and apply link.
    """
    params = {
        "engine": "google_jobs",
        "q": user_query,
        "hl": "en",
        "location": user_location,
        "api_key": SERP_API_KEY
    }

    search = GoogleSearch(params)
    results = search.get_dict()

    jobs = []

    if "jobs_results" in results and results["jobs_results"]:
        for job in results["jobs_results"]:
            # Try to get the first apply option link
            apply_link = "No link available"
            if "apply_options" in job and job["apply_options"]:
                apply_link = job["apply_options"][0].get("link", "No link available")

            jobs.append({
                "title": job.get("title", "N/A"),
                "company": job.get("company_name", "Not provided"),
                "location": job.get("location", "Location not provided"),
                "description": job.get("description", "No description available"),
                "job_link": apply_link
            })
    else:
        print("No job results found.")

    return jobs
@app.route('/search_jobs', methods=['GET'])
def search_jobs():
    """
    API endpoint to search jobs by user input (query & location).
    Example: /search_jobs?query=Data%20Scientist&location=India
    """
    user_query = request.args.get('query', '')  # Job title/role
    user_location = request.args.get('location', '')  # Location

    if not user_query or not user_location:
        return jsonify({"error": "Missing required parameters: query or location"}), 400

    job_results = search_google_jobs(user_query, user_location)

    if not job_results:
        return jsonify({"message": "No job results found"}), 404

    return jsonify(job_results)

if __name__ == '__main__':
    app.run(debug=True, port=5001)
 #the app on port 5001 for testing
