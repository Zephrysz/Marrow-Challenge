from transformers import pipeline, AutoTokenizer, T5Tokenizer, T5ForConditionalGeneration

class TextSummarizerManager():
    def __init__(self):
        self.english_model = pipeline("summarization", model="facebook/bart-large-cnn")
        self.english_tokenizer = AutoTokenizer.from_pretrained("facebook/bart-large-cnn")

        self.portuguese_model = T5ForConditionalGeneration.from_pretrained('phpaiola/ptt5-base-summ-xlsum')
        self.portuguese_tokenizer = T5Tokenizer.from_pretrained('unicamp-dl/ptt5-base-portuguese-vocab')

    def split_text_into_chunks(self, text, max_tokens, tokenizer):
        words = text.split()
        chunks = []
        current_chunk = []
        current_length = 0

        for word in words:
            word_length = len(tokenizer.encode(word, add_special_tokens=False))

            if current_length + word_length > max_tokens:
                chunks.append(" ".join(current_chunk))
                current_chunk = []
                current_length = 0

            current_chunk.append(word)
            current_length += word_length

        if current_chunk:
            chunks.append(" ".join(current_chunk))

        return chunks

    def summarize_english(self, text, max_tokens=500):
        if len(self.english_tokenizer.encode(text, add_special_tokens=False)) < max_tokens:
            return self.english_model(text)[0]['summary_text']

        chunks = self.split_text_into_chunks(text, max_tokens, self.english_tokenizer)
        summaries = []

        for chunk in chunks:
            summaries.append(self.english_model(chunk)[0]['summary_text'])

        combined_summaries = " ".join(summaries)

        return self.summarize_english(combined_summaries, max_tokens)

    def summarize_portuguese(self, text, max_tokens=500):
        if len(self.portuguese_tokenizer.encode(text, add_special_tokens=False)) < max_tokens:
            inputs = self.portuguese_tokenizer.encode(text, max_length=512, add_special_tokens=False, truncation=True, return_tensors='pt')
            summary_ids = self.portuguese_model.generate(inputs, max_length=256, min_length=32, num_beams=5, no_repeat_ngram_size=3, early_stopping=True)
            summary = self.portuguese_tokenizer.decode(summary_ids[0], skip_special_tokens=True)
            return summary

        chunks = self.split_text_into_chunks(text, max_tokens, self.portuguese_tokenizer)
        summaries = []

        for chunk in chunks:
            inputs = self.portuguese_tokenizer.encode(chunk, max_length=512, add_special_tokens=False, truncation=True, return_tensors='pt')
            summary_ids = self.portuguese_model.generate(inputs, max_length=256, min_length=32, num_beams=5, no_repeat_ngram_size=3, early_stopping=True)
            summary = self.portuguese_tokenizer.decode(summary_ids[0], skip_special_tokens=True)
            summaries.append(summary)

        combined_summaries = " ".join(summaries)

        return self.summarize_portuguese(combined_summaries, max_tokens)

    def summarize(self, text, language="english", max_tokens=500):
        if language == "english":
            return self.summarize_english(text, max_tokens)
        elif language == "portuguese":
            return self.summarize_portuguese(text, max_tokens)
        else:
            raise ValueError("Unsupported language: only 'english' or 'portuguese' implemented as of now")