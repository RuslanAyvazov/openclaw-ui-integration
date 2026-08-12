// Shared mock for branch/PR data.
// Used by both the directory feature (file tree + branch UI) and the designer
// feature (importing a stream from a branch into a designer page).
//
// Branch shape: { structure, contents, baseBranch, createdAt, author }
//
// Initial state is deliberately minimal: a single `main` branch with an empty
// mart skeleton and no pull requests. Content arrives from the designer
// (Save / Save As) or from the AI agent (SQL editor → «Загрузить в репозиторий»).

import { BASE_STRUCTURE, BASE_CONTENTS } from '../features/directory/mock';

function deepClone(o) { return JSON.parse(JSON.stringify(o)); }

export function buildInitialBranches() {
    return {
        main: {
            structure: deepClone(BASE_STRUCTURE),
            contents: deepClone(BASE_CONTENTS),
            baseBranch: null,
            createdAt: '2026-04-12T09:00:00Z',
            author: 'Ruslan Ayvazov',
        },
    };
}

export const INITIAL_PULL_REQUESTS = [];
