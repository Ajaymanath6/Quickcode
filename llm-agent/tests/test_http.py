from fastapi.testclient import TestClient

from main import app

client = TestClient(app)


def test_health() -> None:
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["ok"] is True


def test_canvas_plan_submit_button() -> None:
    response = client.post(
        "/canvas/plan",
        json={"prompt": "primary button labeled Submit", "messages": []},
    )
    assert response.status_code == 200
    plan = response.json()["plan"]
    assert plan["nodes"]
    assert plan["nodes"][0]["label"] == "Submit"


def test_generate_code_empty() -> None:
    assert client.post("/generate-code", json={"prompt": ""}).status_code == 422


def test_generate_code_unknown_name() -> None:
    response = client.post("/generate-code", json={"prompt": "NoSuchComponent"})
    assert response.status_code == 404
