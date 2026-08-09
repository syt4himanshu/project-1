export function extractHighlights(text: string | null | undefined): string[] {
    if (!text) return [];

    const positiveWords = [
        'commendable', 'strong performance', 'excellent', 'outstanding',
        'great', 'perfect score', 'notable improvement', 'impressive',
        'brilliant', 'superb', 'fantastic', 'amazing', 'keep it up',
        'well done', 'proud', 'progress', 'achieved', 'success',
        'confident', 'excel', 'good', 'dedication', 'strong', 'perfect'
    ];

    const negativeWords = [
        'but', 'however', 'room for improvement', 'needs', 'lack', 'poor', 'issue', 'struggle'
    ];

    // Split text into sentences safely
    const sentences = text.split(/(?<=[.!?])\s+/).filter(Boolean);

    const scoredSentences = sentences.map(sentence => {
        // Simple word boundary regex matcher
        const countOccurrences = (words: string[]) => {
            return words.reduce((count, word) => {
                const regex = new RegExp(`\\b${word}\\b`, 'i');
                return count + (regex.test(sentence) ? 1 : 0);
            }, 0);
        };

        const score = countOccurrences(positiveWords);
        const penalty = countOccurrences(negativeWords) * 2; // Penalize negatives heavily so we don't highlight mixed sentences

        return {
            sentence: sentence.trim(),
            score: score - penalty
        };
    });

    // Sort by score descending and take top 2 that have a positive score
    return scoredSentences
        .filter(s => s.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 2)
        .map(s => s.sentence);
}
