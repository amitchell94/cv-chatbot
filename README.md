# Resume Chatbot

This repository contains the code for a React-based chatbot interface. This chatbot is designed to answer questions about me by sending user queries to a backend service (n8n webhook) and displaying the conversation.

## Features

* **Interactive Chat Interface:** Allows users to type messages and receive responses.
* **Backend Integration:** Communicates with an n8n webhook to process user messages and fetch answers.
* **Conversation History:** Displays the ongoing conversation between the user and the chatbot.
* **Preset Questions:** Offers a rotating selection of predefined questions to start the conversation. Clicking a preset question sends it to the chatbot and replaces it with a new question from a larger list.
* **Loading Indicator:** Shows a spinner while waiting for a response from the backend.
* **Error Handling:** Displays an error message if the backend API call fails or returns an error.
* **Markdown Support:** Renders chatbot responses using `ReactMarkdown`, allowing for formatted text.
* **Auto-Scroll:** Automatically scrolls to the latest message in the chat window.
* **Responsive Input:** Users can send messages by clicking the "Send" button or pressing "Enter".

## Technologies Used

* **React:** A JavaScript library for building user interfaces.
* **TypeScript:** A superset of JavaScript that adds static typing.
* **ReactMarkdown:** A React component to render Markdown.
* **CSS:** For styling the component .
* **Vite:**  A fast frontend build tool.
* **n8n.io (Backend):** The chatbot logic and data retrieval are handled by an n8n workflow, which is accessed via a webhook URL.

## Setup and Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/amitchell94/cv-chatbot/
    cd cv-chatbot
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of your project and add your n8n webhook URL:
    ```env
    VITE_REACT_APP_N8N_WEBHOOK_URL=your_n8n_webhook_url_here
    ```
    Replace `your_n8n_webhook_url_here` with the actual webhook URL provided by your n8n workflow.

4.  **Run the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```
    This will typically start the application on `http://localhost:5173` (or another port if specified by Vite).

## How to Use

1.  Once the application is running, you will see the chatbot interface.
2.  An avatar image and a title "Ask me anything!" will be displayed.
3.  Below the title, there are three preset question buttons. You can click any of these to send that question to the chatbot. The clicked button will then display a new preset question.
4.  Alternatively, you can type your own question into the input field at the bottom.
5.  Press "Enter" or click the "Send" button to submit your question.
6.  The chatbot will display a loading spinner while fetching the answer.
7.  The chatbot's response will appear in the chat window. User messages are aligned to the right, and bot messages (which can include Markdown formatting) are aligned to the left.
8.  The chat window will automatically scroll to show the latest messages.

## Backend (n8n)

This frontend chatbot component relies on a backend n8n workflow. The n8n workflow is responsible for:

* Receiving the user's message (and conversation history) via a webhook.
* Processing the message (likely using an LLM or other AI model, and a knowledge base about "Andy").
* Returning a response to be displayed by the chatbot.

Ensure your n8n workflow is active and correctly configured to handle requests from this chatbot. The payload sent to the n8n webhook has the following structure:

```json
{
  "messages": [
    { "role": "user", "content": "User's first message" },
    { "role": "assistant", "content": "Bot's first response" },
    { "role": "user", "content": "User's second message" }
    // ... and so on
  ]
}