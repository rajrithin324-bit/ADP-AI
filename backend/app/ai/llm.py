import os
import json
from google import genai
from google.genai import types

class GeminiEngine:
    def __init__(self):
        # Read the free Gemini key from your .env file
        api_key = os.getenv("GEMINI_API_KEY", "")
        self.client = genai.Client(api_key=api_key) if api_key else None

    def route_intent_and_explain(self, user_query: str, dataset_metadata: dict, health_report: dict, trained_metrics: dict = None) -> dict:
        """
        Uses the free Gemini 2.5 Flash model to analyze intent and output structured JSON.
        """
        if not self.client:
            return {
                "intent": "regression",
                "target_column": dataset_metadata.get("column_names", [""])[-1],
                "explanation": "Gemini API token missing or unconfigured. Running fallback metrics."
            }

        system_instruction = """
        You are an advanced expert Automated AI Data Architect. Your goal is to inspect a user's natural text request, study their raw dataset summary structures, and reply with a clean JSON output containing exactly three items:
        1. 'intent': Must be exactly one of ['regression', 'classification', 'clustering', 'forecasting']
        2. 'target_column': The column name that matches what they want to predict or analyze. If clustering, leave empty.
        3. 'explanation': A short, markdown-supported 3-sentence summary highlighting dataset traits, historical patterns, and performance metrics.
        """

        prompt = f"""
        User Request: "{user_query}"
        
        Dataset Structure:
        - Columns: {dataset_metadata.get('column_names')}
        - Continuous Numeric features: {dataset_metadata.get('types', {}).get('numeric')}
        - Categorical features: {dataset_metadata.get('types', {}).get('categorical')}
        - Discovered Missing values: {health_report.get('missing_values')}
        
        Previously Computed Pipeline Metrics (if any):
        {json.dumps(trained_metrics) if trained_metrics else 'None computed yet.'}
        """

        try:
            # Generate structured content using the free-tier model
            response = self.client.models.generate_content(
                model='gemini-2.5-flash',
                contents=prompt,
                config=types.GenerateContentConfig(
                    system_instruction=system_instruction,
                    response_mime_type="application/json"
                )
            )
            return json.loads(response.text)
            
        except Exception as e:
            return {
                "intent": "regression",
                "target_column": dataset_metadata.get("column_names", [""])[-1],
                "explanation": f"Structural analytical mapping engine pipeline fallback: {str(e)}"
            }
