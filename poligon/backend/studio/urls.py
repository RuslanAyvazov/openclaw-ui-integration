from django.urls import path

from studio.api import ai, auth, datamarts, openclaw_internal, ops, workspaces


urlpatterns = [
    path("auth/register", auth.register),
    path("auth/login", auth.login_view),
    path("auth/me", auth.me),
    path("auth/logout", auth.logout_view),

    path("datamarts", datamarts.datamarts),
    path("datamarts/<int:datamart_id>", datamarts.datamarts),
    path("datamarts/<int:datamart_id>/designer-state", datamarts.designer_state),
    path("datamarts/<int:datamart_id>/repository", datamarts.repository),

    path("workspaces", workspaces.workspaces),
    path("workspaces/public", workspaces.public_workspaces),
    path("workspaces/<int:workspace_id>", workspaces.workspaces),
    path("workspaces/<int:workspace_id>/members", workspaces.members),
    path("workspaces/<int:workspace_id>/members/<int:user_id>", workspaces.members),
    path("workspaces/<int:workspace_id>/requests", workspaces.join_requests),
    path("workspaces/<int:workspace_id>/requests/<int:request_id>", workspaces.join_requests),

    path("monitoring", ops.monitoring),
    path("deploy", ops.deploy),
    path("deploy/<str:deploy_id>", ops.deploy),
    path("streams/<int:datamart_id>", ops.streams),

    path("ai/health", ai.ai_health),
    path("ai/agents", ai.agents),
    path("ai/agent/provision", ai.provision_agent),
    path("ai/llm-connection", ai.llm_connection),
    path("ai/chat", ai.chat),
    path("ai/build", ai.build),
    path("ai/drafts/<uuid:draft_id>", ai.draft),
    path("ai/conversations", ai.conversations),
    path("ai/conversations/active", ai.active_conversation),
    path("ai/conversations/<str:conversation_id>", ai.conversations),

    path("internal/openclaw/catalog", openclaw_internal.catalog),
    path("internal/openclaw/repository", openclaw_internal.repository),
    path("internal/openclaw/repository/import-branch", openclaw_internal.import_branch),
]
