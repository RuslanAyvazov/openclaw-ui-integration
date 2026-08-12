import json
import tempfile
from pathlib import Path
from unittest.mock import patch

from django.test import TestCase, override_settings

from studio.models import Datamart, User, Workspace, WorkspaceMembership


class RegistrationTests(TestCase):
    @patch("studio.api.auth.ensure_openclaw_agent")
    def test_registration_creates_personal_workspace_and_requests_agent(self, ensure_agent):
        response = self.client.post("/api/auth/register", data=json.dumps({
            "login": "anna",
            "name": "Анна Петрова",
            "email": "anna@example.test",
            "password": "safe-password-2026",
        }), content_type="application/json")

        self.assertEqual(response.status_code, 201)
        user = User.objects.get(username="anna")
        self.assertTrue(user.workspace_memberships.filter(role="admin").exists())
        ensure_agent.assert_called_once_with(user)
        self.assertEqual(self.client.get("/api/auth/me").status_code, 200)


class RepositoryTests(TestCase):
    def setUp(self):
        self.owner = User.objects.create_user(
            username="owner", email="owner@example.test", display_name="Owner", password="password-2026"
        )
        workspace = Workspace.objects.create(name="Owner workspace", slug="owner", created_by=self.owner)
        WorkspaceMembership.objects.create(workspace=workspace, user=self.owner, role="admin")
        self.datamart = Datamart.objects.create(
            workspace=workspace, created_by=self.owner, name="orders", display_name="Orders"
        )

    def test_repository_metadata_is_in_database_and_file_is_scoped_to_owner(self):
        with tempfile.TemporaryDirectory() as root, override_settings(REPOSITORIES_ROOT=Path(root)):
            self.client.force_login(self.owner)
            payload = {
                "version": 5,
                "activeBranch": "main",
                "pullRequests": [],
                "commits": [{"hash": "abc", "message": "test"}],
                "branches": {
                    "main": {
                        "contents": {"etl/orders/DML.sql": "SELECT 1"},
                        "baseBranch": None,
                        "author": "Owner",
                    }
                },
            }
            response = self.client.put(
                f"/api/datamarts/{self.datamart.id}/repository",
                data=json.dumps(payload), content_type="application/json",
            )

            self.assertEqual(response.status_code, 200)
            stored = Path(root) / str(self.owner.id) / "datamarts" / str(self.datamart.id)
            self.assertEqual(
                (stored / "branches" / "main" / "etl" / "orders" / "DML.sql").read_text(encoding="utf-8"),
                "SELECT 1",
            )
            self.assertEqual(self.datamart.repository_state.commits[0]["hash"], "abc")

    def test_repository_rejects_parent_directory_escape(self):
        with tempfile.TemporaryDirectory() as root, override_settings(REPOSITORIES_ROOT=Path(root)):
            self.client.force_login(self.owner)
            response = self.client.put(
                f"/api/datamarts/{self.datamart.id}/repository",
                data=json.dumps({
                    "branches": {"main": {"contents": {"../outside.sql": "SELECT 1"}}},
                }),
                content_type="application/json",
            )
            self.assertEqual(response.status_code, 400)


class ConversationTests(TestCase):
    def test_conversation_is_private_and_persistent(self):
        user = User.objects.create_user(
            username="chat", email="chat@example.test", display_name="Chat", password="password-2026"
        )
        self.client.force_login(user)
        response = self.client.put(
            "/api/ai/conversations/c-1?scope=global",
            data=json.dumps({"title": "S2T", "messages": [{"role": "user", "text": "Проверить S2T"}]}),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 200)
        history = self.client.get("/api/ai/conversations?scope=global").json()
        self.assertEqual(history["activeConversationId"], "c-1")
        self.assertEqual(history["items"][0]["messages"][0]["text"], "Проверить S2T")


class LlmConnectionTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="agent-user",
            email="agent-user@example.test",
            display_name="Agent User",
            password="password-2026",
            openclaw_agent_id="user-9-agent-user",
            openclaw_agent_name="AI Agent — Agent User",
            openclaw_agent_status="ready",
        )
        self.client.force_login(self.user)

    @patch("studio.api.ai.model_connection")
    def test_connection_status_never_contains_token(self, status):
        status.return_value = {
            "configured": False,
            "providerName": "RouterAI",
            "modelName": "DeepSeek V4 Pro",
        }
        response = self.client.get("/api/ai/llm-connection")
        self.assertEqual(response.status_code, 200)
        self.assertFalse(response.json()["configured"])
        self.assertNotIn("token", response.json())

    @patch("studio.api.ai.save_model_connection")
    def test_token_is_forwarded_without_being_returned(self, save_connection):
        save_connection.return_value = {
            "configured": True,
            "providerName": "RouterAI",
            "modelName": "DeepSeek V4 Pro",
        }
        token = "private-user-token"
        response = self.client.put(
            "/api/ai/llm-connection",
            data=json.dumps({"token": token}),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 200)
        save_connection.assert_called_once_with(self.user, token)
        self.assertNotIn("token", response.json())
