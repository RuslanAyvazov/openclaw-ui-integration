// Mock API responses for Directory feature.
// Replace with real fetch calls when git/file API is ready.
//
// Canonical mart structure (see b2c-sql-project/SKILL.md):
//   <mart>/
//   ├── etl/<stream>/          # flat stream files
//   │     DDL.sql, DML.sql, historicity.sql, move_table.sql, coalesce.sql,
//   │     ctl.yml, mart.yml, b2c_sql_config.json
//   └── resources/devops.json
//
// The repository starts EMPTY: a bare skeleton (etl/ + resources/) on `main`
// and nothing else. Streams appear when the user saves them from the
// designer or loads an AI-agent-built datamart from the SQL editor chat.

export const BASE_STRUCTURE = {
    repo: 'project/mart-flow',
    name: 'mart-flow',
    type: 'folder',
    children: [
        { name: 'etl',       type: 'folder', children: [] },
        { name: 'resources', type: 'folder', children: [] },
    ],
};

export const BASE_CONTENTS = {};

// ── ctl.yml / mart.yml templates (вне области навыка — служебные) ──────────

export function defaultStreamCtl(streamName) {
    return `# Pipeline config for the ${streamName} stream
stream: ${streamName}
schedule: "0 2 * * *"
timezone: Europe/Moscow
retries: 2
retry_delay: 300
sla_minutes: 60
notifications:
  on_failure:
    - dw-team@company.ru
`;
}

export function defaultStreamMart(streamName) {
    return `# Mart definition for the ${streamName} stream
target:
  table: mart.${streamName}
  format: iceberg
`;
}

export const MOCK_COMMITS = [
    {
        hash: 'g8c2b5d',
        message: 'chore: init repository (etl/ + resources/)',
        author: 'Ruslan Ayvazov',
        initials: 'RA',
        time: '2w ago',
        additions: 0,
        deletions: 0,
        changedFiles: 0,
        branch: 'main',
    },
];
