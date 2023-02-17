export interface MessageDB {
  content: string;
  endDate: Date;
  active: boolean;
  title: string;
}

export interface Message extends MessageDB {
  id: string;
}

export interface MessageDTO {
  content: string;
  endDate: Date;
  active: boolean;
  title: string;
  id?: string;
}
