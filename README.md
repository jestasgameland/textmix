# wordmix
TextMix - An app for automating the creation of "word jumble" and cloze activities from corpora for English language learners

RECENT UPDATES:
- mobile support
- added "research mode" - pass through URL (?=researchmode=true) - This records the number of correct/incorrect answers by the user
- added cloze modes, for focusing on grammar structures or 100 most common words in English
- added option to create printable worksheet on save screen
- added reading mode (sentences stay on screen after being solved)
- added teacher/student modes and review screen
- cleaner code and more user-friendly, many bug fixes and popup explanations
- added "about" page
- support for splitting sentences ending with different punctuation
- option to create printable worksheet on save screen
- support for "news headlines" (newsapi.org) and list of words (Tatoeba corpus) as text sources

TO DO:
- More APIs as text sources, add more texts for student mode
- Wordnik API for getting examples senences with a list of target words the user enters - good for teachers to assign focused vocab exposure
- JSON file size limit?  Eventually move to SQL database instead
- Japanese language support (split sentences by "。" and "、" ).  But then how to split word???  (no spaces in Japanese) - could try Google Natural Language API
- Kidz mode - uses an even simpler settings interface and special kids JSON file with kid-friendly texts
- User guide


