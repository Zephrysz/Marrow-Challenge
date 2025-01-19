from openai import OpenAI


class TextFormatterManager():
    def __init__(self):
        self.client = OpenAI()
    
    # maybe should've used structured outputs to enforce the teacher and student
    def format_text(self, text):
        try:
            response = self.client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                "role": "system",
                "content":
                    '''
                    You will receive a transcript of an audio recording captured in an educational environment. The text is unformatted and may contain dialogue from both teachers and students. Your task is to:
                    1. Format the transcript by separating the text into coherent paragraphs for better readability.
                    2. Infer the speaker (Teacher or Student) based on context and clearly label each speaker.
                    3. Translate speaker labels ("Teacher" and "Student") into the language used in the transcript, for instance, for portuguese, it would be [PROFESSOR] and [ESTUDANTE], if necessary.
                    4. Handle cases where only one person (e.g., the teacher) is speaking, ensuring the text is still divided into logical paragraphs, you should divide into paragraphs, and repeat the [TEACHER], and add new lines.

                    The response format must strictly follow this pattern:
                    ```
                    [SPEAKER]: Text of the dialogue or speech.\n\n
                    ```
                    The text after SPEAKER should be a logical paragraph and only one paragraph per instance
                    After each instance of this, you MUST add 2 new lines, to separate each instance 

                    For example:
                    ```
                    [TEACHER]: Hello, class. Today we will discuss photosynthesis. \n\n
                    [STUDENT]: I have a question about the process. \n\n
                    [PROFESSOR]: Bom dia classe, hoje iremos discutir sobre fotossintese \n\n
                    [PROFESSOR]: A fotossintese e um processo que as plantas realizam... \n\n
                    ```

                    Remember:
                    - Accurately separate the dialogue into coherent paragraphs, even if it's not explicitly clear in the raw transcript.
                    - Be mindful that in some cases, only the teacher may be speaking, and in such cases, proper paragraph division is still required.
                    - Don't return the triple quotes in your answer
                    - Add new lines (break lines) after every instance of [SPEAKER]: PHRASE 
                    - TRANSLATE the SPEAKER to the correct language
                    Format the response exactly as specified without deviating from this structure.
                    '''
                },
                {"role": "user", "content": f"{text}"},
                ]
            )
            return response.choices[0].message.content
        except Exception as e:
            return {"error": str(e)}
