# Vietnam optional assessment release

Builds on 6f1602d42740fb36d51b8d9917ec0796b1876c89; preserves earlier corrected releases including 70939b8646d4d31d8a9727dc9b87f334ec4717e9.

Registration assessment moved below the existing contact/message fields into a collapsed optional details section, before consent. All existing registration fields and separate assessment are preserved. No assessment answer is required to register, even if partly filled. Completed standalone or embedded attempts are retained in memory during the current page visit; no cross-device or closed-page recovery is claimed. Explicit repeated completions are preserved, including identical answers; automatic payload preparation avoids adding the same saved attempt again. A complete embedded assessment is automatically archived when submitting or preparing the email/copy fallback. Notifications include each saved readable report with UTC completion timestamp, answers, score and recommendation. Missing completion is explicitly reported. Existing notification routing, consent, CAPTCHA and shared systems are unchanged. No An CC or country permission change.

Validation: DOM checks pass for skipped/partial assessment, collapsed layout and field order, standalone results, repeated attempts, automatic completion, historic answer preservation, timestamps, readable form payload and unchanged recipient. Actual email delivery and live desktop/mobile visual rendering remain unverified. No real registration or promotional message sent.

International coordination: preserve the latest Vietnam main commit; do not overwrite with international packages. No Indonesia/Thailand files, shared authentication or database permissions changed. This note is a handoff, not evidence of cross-chat receipt.
