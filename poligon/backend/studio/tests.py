import json
import tempfile
from pathlib import Path
from unittest.mock import patch

from django.test import TestCase, override_settings

from studio.models import Datamart, User, Workspace, WorkspaceMembership
from studio.services.repositories import save_repository, serialize_repository


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

    @patch("studio.api.ai.gateway_request")
    @patch("studio.api.ai.stage_agent_attachments")
    @patch("studio.api.ai.model_connection")
    def test_chat_stages_attachments_and_streams_upload_path(
        self, connection, stage_attachments, gateway
    ):
        connection.return_value = {"configured": True}
        stage_attachments.return_value = {
            "uploadPath": "uploads/package-test",
            "files": [
                {
                    "name": "S2T.xlsx",
                    "relativePath": "uploads/package-test/S2T.xlsx",
                    "size": 4,
                }
            ],
        }

        class GatewayResponse:
            ok = True
            status_code = 200
            text = ""
            headers = {"content-type": "text/event-stream"}

            @staticmethod
            def iter_lines(**_kwargs):
                yield b'data: {"choices":[{"delta":{"content":"ok"}}]}'
                yield b""
                yield b"data: [DONE]"
                yield b""

            @staticmethod
            def close():
                return None

        gateway.return_value = GatewayResponse()
        response = self.client.post(
            "/api/ai/chat",
            data=json.dumps({
                "agentId": self.user.openclaw_agent_id,
                "conversationId": "conversation-1",
                "storage": "iceberg",
                "messages": [{"role": "user", "content": "Обнови витрину"}],
                "attachments": [{"name": "S2T.xlsx", "base64": "eGxzeA=="}],
            }),
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response["X-B2C-Upload-Path"], "uploads/package-test")
        self.assertIn(b'"content":"ok"', b"".join(response.streaming_content))
        stage_attachments.assert_called_once_with(
            self.user,
            f"b2csql:{self.user.id}:conversation-1",
            [{"name": "S2T.xlsx", "base64": "eGxzeA=="}],
        )
        request_body = gateway.call_args.kwargs["json"]
        self.assertTrue(request_body["stream"])
        self.assertIn(
            "uploadPath: uploads/package-test",
            request_body["messages"][-1]["content"],
        )


class OpenClawInternalApiTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="mart-agent",
            email="mart-agent@example.test",
            display_name="Mart Agent",
            password="password-2026",
            openclaw_agent_id="user-20-mart-agent",
            openclaw_agent_status="ready",
        )
        self.other = User.objects.create_user(
            username="other",
            email="other@example.test",
            display_name="Other",
            password="password-2026",
        )
        self.workspace = Workspace.objects.create(
            name="Sales Space", slug="sales-space", created_by=self.user
        )
        self.hidden_workspace = Workspace.objects.create(
            name="Hidden Space", slug="hidden-space", created_by=self.other
        )
        WorkspaceMembership.objects.create(
            workspace=self.workspace, user=self.user, role="developer"
        )
        WorkspaceMembership.objects.create(
            workspace=self.hidden_workspace, user=self.other, role="admin"
        )
        self.datamart = Datamart.objects.create(
            workspace=self.workspace,
            created_by=self.user,
            name="sales_mart",
            display_name="Продажи",
        )
        Datamart.objects.create(
            workspace=self.hidden_workspace,
            created_by=self.other,
            name="hidden_mart",
            display_name="Скрытая витрина",
        )

    def _post(self, route, payload, token="internal-test-token"):
        return self.client.post(
            route,
            data=json.dumps(payload),
            content_type="application/json",
            HTTP_AUTHORIZATION=f"Bearer {token}",
        )

    def test_catalog_export_and_new_branch_are_scoped_to_agent_user(self):
        with tempfile.TemporaryDirectory() as root:
            root_path = Path(root)
            token_file = root_path / "token"
            token_file.write_text("internal-test-token\n", encoding="utf-8")
            with override_settings(
                REPOSITORIES_ROOT=root_path / "repositories",
                OPENCLAW_CONTROL_TOKEN_FILE=token_file,
            ):
                save_repository(self.datamart, {
                    "version": 5,
                    "activeBranch": "main",
                    "branches": {
                        "main": {
                            "contents": {
                                "etl/orders/DDL.sql": "CREATE TABLE dm.orders (id BIGINT);"
                            },
                            "baseBranch": None,
                            "author": "Mart Agent",
                        }
                    },
                })

                catalog = self._post(
                    "/api/internal/openclaw/catalog",
                    {"agentId": self.user.openclaw_agent_id},
                )
                self.assertEqual(catalog.status_code, 200)
                self.assertEqual(
                    [item["name"] for item in catalog.json()["workspaces"]],
                    ["Sales Space"],
                )
                self.assertEqual(
                    catalog.json()["workspaces"][0]["datamarts"][0]["name"],
                    "sales_mart",
                )

                exported = self._post(
                    "/api/internal/openclaw/repository",
                    {
                        "agentId": self.user.openclaw_agent_id,
                        "workspace": "Sales Space",
                        "datamart": "sales_mart",
                        "branch": "main",
                    },
                )
                self.assertEqual(exported.status_code, 200)
                self.assertIn("etl/orders/DDL.sql", exported.json()["contents"])

                imported = self._post(
                    "/api/internal/openclaw/repository/import-branch",
                    {
                        "agentId": self.user.openclaw_agent_id,
                        "workspace": "sales-space",
                        "datamart": "Продажи",
                        "branch": "openclaw/update-test",
                        "baseBranch": "main",
                        "contents": {
                            **exported.json()["contents"],
                            "etl/returns/DDL.sql": "CREATE TABLE dm.returns (id BIGINT);",
                        },
                    },
                )
                self.assertEqual(imported.status_code, 201)
                repository = serialize_repository(self.datamart)
                self.assertIn("openclaw/update-test", repository["branches"])
                self.assertNotIn(
                    "etl/returns/DDL.sql",
                    repository["branches"]["main"]["contents"],
                )

    def test_internal_api_rejects_wrong_token(self):
        with tempfile.TemporaryDirectory() as root:
            token_file = Path(root) / "token"
            token_file.write_text("internal-test-token\n", encoding="utf-8")
            with override_settings(OPENCLAW_CONTROL_TOKEN_FILE=token_file):
                response = self._post(
                    "/api/internal/openclaw/catalog",
                    {"agentId": self.user.openclaw_agent_id},
                    token="wrong-token",
                )
        self.assertEqual(response.status_code, 401)
