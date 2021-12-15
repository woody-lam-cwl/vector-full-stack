# Part 5 - Further Discussions

## Hypothetical API

The current REST API allows and implements method for adding, removing and updating cards. It is assumed that card type is unique throughout the entire project (by taking it as the primary key of the database). The entire backend would however be more easily maintained if a number-based index can be added as a primary key. Specs of each field in the database should also be further clarified for data validation and table setup.

## Concurrent edits of multiple users

Concurrent edits rely on real time data updates whenever a change is made by other clients. This means as opposed to the client-initiated acitivities mentioned in project architecture, server-initiated communication with the frontend is necessary to achieve this target. Websockets and server-sent events (SSE) are options to consider.

In addition to real time updates from server, an efficient comparison logic/algorithm should also be derived to account for changes and explore whether there are conflicts between changes made by different clients. A conflict resolution process is then needed to handle the issue.
