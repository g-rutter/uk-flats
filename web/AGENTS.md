# Web interface guidance

Write all visitor-facing labels and messages in plain, decision-useful language.
Never expose CSV, JavaScript or calculation field names (for example
`proxyMonthly` or `proxyMedian`) in the interface. Use a short, specific label
instead. Where a concise label cannot explain a measure's scope,
meaning or important limitation, add an accessible click-to-open explanation or
a nearby short explanation.

Keep caveats useful and concrete: say what the figure represents and what it
does not represent, rather than relying on internal terms such as “proxy” or
“screen”. Preserve evidence limitations, but do not surface implementation
history unless it helps a visitor interpret a result.

Filters must clearly state what they affect. Controls that change only the table
must live with the table and say that they order the list; do not imply that they
change the map or scores. Keep map keys visually matched to their markers and
use the shared pine, amber, clay and neutral palette defined in `styles.css`.
