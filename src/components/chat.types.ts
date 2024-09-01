export interface ChatItem {
    role: "user" | "assistant";
    content: string;
}

export interface Chat {
    id: number;
    chat: ChatItem[];
}

export interface ChatHistoryItem {
    title: string;
    chatId: number;
}
