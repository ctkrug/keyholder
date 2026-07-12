# Security

Keyholder's entire threat model rests on one architectural fact: there is no server. Everything
you type stays in your browser tab and is never transmitted. If you find code that contacts a
network endpoint with user-entered data — or any other way that claim could be violated — please
report it.

## Reporting a vulnerability

Open a GitHub issue, or if the finding is sensitive, use GitHub's
["Report a vulnerability"](../../security/advisories/new) private disclosure form on this repo.

## Out of scope

Keyholder does not handle authentication, sessions, or server-side storage, so classes of bugs
tied to those (session fixation, SSRF, auth bypass) don't apply — there is no backend to target.
