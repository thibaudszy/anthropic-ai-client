export interface ChatItem {
    role: "user" | "assistant";
    content: string;
    htmlContent: string;
    id: number;
}

export interface Chat {
    id: string;
    title: string;
    chat: ChatItem[];
}

export interface ChatHistoryItem {
    title: string;
    chatId: string;
}
