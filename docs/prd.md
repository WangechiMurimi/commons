# Product Requirements Document

```
Project name: Commons
Version: 0.1
Status: draft · 2026-11-25
```

Items marked _proposed_ are assumptions awaiting confirmation.

## Problem Statement

The abundance of digital content has created an environment in which information is not only readily available but constantly presented. Across numerous platforms, continuously updating feeds, recommendation mechanisms and growing collections of saved content contribute to an overwhelming consumption experience.

There is an opportunity to create a centralised content environment that supports personal curation and allows users to establish their own consumption boundaries by controlling the volume and frequency of content delivery.

## Product pillars

Commons combines three parts. Details of each are still open.

- **Unified subscription reader:** one place for the sources a user follows.
- **Personal interest spaces:** groups of sources arranged by interest, activity or intention.
- **Personal knowledge environment:** temporary saving and personal notes, without a permanent archive.

## Goals and success metrics

All _proposed_.

| Goal                           | Metric                                         | Target |
| ------------------------------ | ---------------------------------------------- | ------ |
| Consumption feels finite       | Median session ends at "caught up"             | ≥ 70%  |
| Saved content does not pile up | Shelf items acted on or expired within 14 days | ≥ 80%  |
| One place replaces many        | Sources connected per active user              | ≥ 5    |

## Objectives

- Centralise content from user-selected sources.
- Enable users to organise sources according to different interests and intentions.
- Provide control over feed composition.
- Establish finite consumption experiences.
- Enable temporary content saving without creating a permanent archive.

## Domain vocabulary

_Proposed._

| Term              | Meaning                                                            |
| ----------------- | ------------------------------------------------------------------ |
| Source            | A feed the user follows (RSS, Atom, podcast, YouTube channel feed) |
| Item              | One piece of content from a source: title, source, format, length  |
| Space             | A user-defined group of sources (interest, activity or intention)  |
| Delivery schedule | When and how often new items are released to the user              |
| Shelf             | Temporary saves that expire (default 14 days)                      |
| Note              | A personal note, part of the knowledge environment                 |

## Non-goals

_Proposed._

- No recommendation algorithm.
- No infinite scroll or endless feed.
- No permanent archive of saved content.
- No social features (sharing, followers, comments).
- No native mobile apps in this version.
- No sources without an open feed (for example Instagram or X) in the MVP.

## User stories (MVP)

Each story gets one Playwright journey in `e2e/`.

| ID    | User Story                                                                                                                                               | Acceptance Criteria                                                                                                                                         |
| ----- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| US-01 | As a user, I want to connect the sources I follow across platforms, so that I check one place instead of many.                                           | I can add a source from any supported platform and see its content in Commons. I can remove a source without affecting my account on the original platform. |
| US-02 | As a user, I want content from different sources to look consistent, so that I can compare and choose items without adjusting to each platform's layout. | Every item shows source, format, and length in the same way.                                                                                                |
| US-03 | As a user, I want to group content by interest, activity, or intention, so that I can open the right collection for what I'm doing.                      | I can create, rename, and reorder groups. One source can feed more than one group.                                                                          |
| US-04 | As a user, I want to decide when and how often my feed is delivered, so that my consumption follows my schedule.                                         | I can set delivery times. Items published between sessions wait for the next one.                                                                           |

## Data model (sketch)

_Proposed. Decided in [ADR 0004](adr/0004-data-model-and-auth.md)._

| Entity           | Key fields                                 | Owner (RLS) |
| ---------------- | ------------------------------------------ | ----------- |
| Source           | url, platform, title                       | `user_id`   |
| Item             | source, title, format, length, publishedAt | `user_id`   |
| Space            | name, position                             | `user_id`   |
| SpaceSource      | space, source (many-to-many)               | `user_id`   |
| DeliverySchedule | space, times, frequency                    | `user_id`   |
| ShelfItem        | item, savedAt, expiresAt                   | `user_id`   |
| Note             | title, body                                | `user_id`   |

## Constraints

- Accessibility: WCAG 2.2 AA (axe passes on every page).
- Auth: Supabase email magic link (_proposed_, ADR 0004).
- Ingestion: server-side feed fetching, because browsers cannot fetch most feeds (CORS). See [ADR 0003](adr/0003-server-side-ingestion.md).
- Hosting: Netlify.

## Open questions

- Which platforms count as "supported" for the MVP beyond RSS, Atom and podcast feeds?
- How is length measured for each format (reading time, duration)?
- Does the delivery schedule apply per space or to the whole account?
- What happens to items that arrive while the user is away for a long time?
- What does the personal knowledge environment hold beyond notes?
