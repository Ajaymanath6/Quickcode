import json
import os
from typing import Any, Optional


class VertexCredentialError(Exception):
    def __init__(self, detail: str) -> None:
        super().__init__(detail)
        self.detail = detail


def vertex_mock_enabled() -> bool:
    return os.environ.get("VERTEX_MOCK", "1").strip().lower() in {"1", "true", "yes"}


def load_vertex_client() -> Any:
    """Lazy Method 2: AWS Secrets Manager credential_json → google.auth.aws → genai."""
    if vertex_mock_enabled():
        raise VertexCredentialError("VERTEX_MOCK=1")
    project = os.environ.get("GCP_PROJECT", "").strip()
    if not project:
        raise VertexCredentialError("GCP_PROJECT is missing")
    secret_name = os.environ.get("AWS_SECRET_NAME", "").strip()
    if not secret_name:
        raise VertexCredentialError("AWS_SECRET_NAME is missing")
    location = os.environ.get("GCP_LOCATION", "us-central1").strip()
    try:
        import boto3
        from google import genai
        from google.auth import aws as google_aws
    except ImportError as error:
        raise VertexCredentialError(f"Vertex libraries not installed: {error}") from error
    region = os.environ.get("AWS_REGION", "us-east-1")
    sm = boto3.client("secretsmanager", region_name=region)
    payload = sm.get_secret_value(SecretId=secret_name)
    raw = payload.get("SecretString") or ""
    try:
        parsed = json.loads(raw)
    except json.JSONDecodeError as error:
        raise VertexCredentialError("Secret is not JSON") from error
    credential_json = parsed.get("credential_json")
    if not credential_json:
        raise VertexCredentialError("Secret missing credential_json")
    info = json.loads(credential_json) if isinstance(credential_json, str) else credential_json
    if not isinstance(info, dict):
        raise VertexCredentialError("credential_json has a bad shape")
    creds = google_aws.Credentials.from_info(info)
    return genai.Client(
        vertexai=True,
        project=project,
        location=location,
        credentials=creds,
    )
