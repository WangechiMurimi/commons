Product Requirements Document — Commons

```
Version: 0.1
Status: draft · 2026-11-25
```

## Product Description

The abundance of digital content has created an environment in which information is not only readily available but constantly presented. Across numerous platforms, continuously updating feeds, recommendation mechanisms and growing collections of saved content contribute to an overwhelming consumption experience.

There is an opportunity to create a centralised content environment that supports personal curation and allows users to establish their own consumption boundaries by controlling the volume and frequency of content delivery.

## Core Application Capabilities

- **Unified subscription reader:** A single environment for user-selected content sources.
- **Personal interest spaces:** Collections of sources organised by interest, activity or intention.
- **Personal knowledge environment:** Temporary content saving and personal notes without a permanent content archive.

## Objectives

- Centralise content from user-selected sources.
- Enable users to organise sources according to different interests and intentions.
- Provide control over feed composition.
- Establish finite consumption experiences.
- Enable temporary content saving without creating a permanent archive.

## Domain vocabulary

| Term   | Meaning                                         |
| ------ | ----------------------------------------------- |
| Source | A content feed followed by the user.            |
| Item   | One piece of content from a source.             |
| Space  | A user-defined collection of sources.           |
| Shelf  | A temporary collection of saved items.          |
| Note   | A personal knowledge entry created by the user. |

## Non-goals

- No recommendation algorithm.
- No infinite scroll or endless feed.
- No permanent archive of saved content.
- No social features (sharing, followers, comments).
- No native mobile apps in this version.

## User stories (MVP)

Each story gets one Playwright journey in `e2e/`.

| ID    | User Story                                                                                                                                               | Acceptance Criteria                                                                                                                                         |
| ----- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| US-01 | As a user, I want to connect the sources I follow across platforms, so that I check one place instead of many.                                           | I can add a source from any supported platform and see its content in Commons. I can remove a source without affecting my account on the original platform. |
| US-02 | As a user, I want content from different sources to look consistent, so that I can compare and choose items without adjusting to each platform's layout. | Every item shows source, format, and length in the same way.                                                                                                |
| US-03 | As a user, I want to group content by interest, activity, or intention, so that I can open the right collection for what I'm doing.                      | I can create, rename, and reorder groups. One source can feed more than one group.                                                                          |
| US-04 | As a user, I want to decide when and how often my feed is delivered, so that my consumption follows my schedule.                                         | I can set delivery times. Items published between sessions wait for the next one.                                                                           |

## Constraints

- Accessibility: WCAG 2.2 AA (axe passes on every page).
- Auth: email and password, Google, password recovery [ADR 0005](adr/0005-auth-methods.md).
- Ingestion: server-side feed fetching, because browsers cannot fetch most feeds (CORS). See [ADR 0003](adr/0003-server-side-ingestion.md).
- Hosting: Netlify.

## Open questions

- Which platforms count as "supported" for the MVP beyond RSS, Atom and podcast feeds?
- How is length measured for each format (reading time, duration)?
- Does the delivery schedule apply per space or to the whole account?
- What happens to items that arrive while the user is away for a long time?
- What does the personal knowledge environment hold beyond notes?
