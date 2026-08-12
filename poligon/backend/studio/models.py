import uuid

from django.contrib.auth.models import AbstractUser
from django.db import models


def empty_dict():
    return {}


def empty_list():
    return []


class User(AbstractUser):
    # Legacy Node.js scrypt hashes are longer than Django's default 128 chars.
    # After a successful login they are transparently upgraded to PBKDF2.
    password = models.CharField(max_length=256, verbose_name="password")
    display_name = models.CharField(max_length=160)
    email = models.EmailField(unique=True)
    openclaw_agent_id = models.CharField(max_length=64, blank=True)
    openclaw_agent_name = models.CharField(max_length=180, blank=True)
    openclaw_agent_status = models.CharField(max_length=24, default="pending")
    openclaw_agent_error = models.TextField(blank=True)
    ui_preferences = models.JSONField(default=empty_dict, blank=True)

    @property
    def public_name(self):
        return self.display_name or self.get_full_name() or self.username


class Workspace(models.Model):
    name = models.CharField(max_length=160)
    slug = models.SlugField(max_length=80, unique=True)
    description = models.TextField(blank=True)
    color = models.CharField(max_length=16, default="#3498db")
    is_public = models.BooleanField(default=False)
    created_by = models.ForeignKey(User, on_delete=models.PROTECT, related_name="created_workspaces")
    created_at = models.DateTimeField(auto_now_add=True)


class WorkspaceMembership(models.Model):
    ROLE_CHOICES = [("admin", "Администратор"), ("developer", "Разработчик"), ("analyst", "Аналитик")]

    workspace = models.ForeignKey(Workspace, on_delete=models.CASCADE, related_name="memberships")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="workspace_memberships")
    role = models.CharField(max_length=16, choices=ROLE_CHOICES, default="analyst")
    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [models.UniqueConstraint(fields=["workspace", "user"], name="unique_workspace_member")]


class WorkspaceJoinRequest(models.Model):
    workspace = models.ForeignKey(Workspace, on_delete=models.CASCADE, related_name="join_requests")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="workspace_requests")
    message = models.TextField(blank=True)
    status = models.CharField(max_length=16, default="pending")
    requested_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [models.UniqueConstraint(fields=["workspace", "user", "status"], name="unique_workspace_request_status")]


class Datamart(models.Model):
    workspace = models.ForeignKey(Workspace, on_delete=models.CASCADE, related_name="datamarts", null=True, blank=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name="datamarts")
    name = models.CharField(max_length=180)
    display_name = models.CharField(max_length=180)
    description = models.TextField(blank=True)
    owner_name = models.CharField(max_length=180, blank=True)
    status = models.CharField(max_length=24, default="draft")
    passport = models.JSONField(default=empty_dict, blank=True)
    designer_state = models.JSONField(default=empty_dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class RepositoryState(models.Model):
    datamart = models.OneToOneField(Datamart, on_delete=models.CASCADE, related_name="repository_state")
    version = models.PositiveIntegerField(default=1)
    active_branch = models.CharField(max_length=160, default="main")
    branches_meta = models.JSONField(default=empty_dict, blank=True)
    pull_requests = models.JSONField(default=empty_list, blank=True)
    commits = models.JSONField(default=empty_list, blank=True)
    updated_at = models.DateTimeField(auto_now=True)


class AiConversation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="ai_conversations")
    scope = models.CharField(max_length=80, default="global")
    conversation_id = models.CharField(max_length=96)
    title = models.CharField(max_length=180, default="Новый диалог")
    messages = models.JSONField(default=empty_list, blank=True)
    project_name = models.CharField(max_length=180, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [models.UniqueConstraint(fields=["user", "scope", "conversation_id"], name="unique_user_conversation")]


class BuildDraft(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="build_drafts")
    context_config = models.JSONField(default=empty_dict)
    project_files = models.JSONField(default=empty_dict)
    summary = models.JSONField(default=empty_dict)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()


class DeployRun(models.Model):
    deploy_id = models.CharField(max_length=64, unique=True)
    datamart = models.ForeignKey(Datamart, on_delete=models.CASCADE, related_name="deploy_runs")
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name="deploy_runs")
    environment = models.CharField(max_length=32, default="PSI")
    cluster = models.CharField(max_length=120, default="cluster-a")
    mode = models.CharField(max_length=32, default="Full")
    status = models.CharField(max_length=32, default="PENDING")
    progress = models.PositiveSmallIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)


class MonitoringRun(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="monitoring_runs")
    datamart = models.ForeignKey(Datamart, on_delete=models.CASCADE, related_name="monitoring_runs", null=True, blank=True)
    payload = models.JSONField(default=empty_dict)
    created_at = models.DateTimeField(auto_now_add=True)
