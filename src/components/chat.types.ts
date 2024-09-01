export interface ChatItem {
    role: "user" | "assistant";
    content: string;
}

export interface Chat {
    id: string;
    chat: ChatItem[];
}

export interface ChatHistoryItem {
    title: string;
    chatId: number;
}
