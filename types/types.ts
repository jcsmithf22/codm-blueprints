export type Characteristics = {
  pros: string[];
  cons: string[];
};

export type Attachment = {
  characteristics: Characteristics;
  id?: number;
  type: number;
  model: number;
};

export type Model = {
  id?: number;
  name: string;
  type: string;
};

export type AttachmentName = {
  id?: number;
  name: string;
  type: string;
};

export type JoinedAttachment = {
  id: number;
  attachment_names: {
    name: string;
    type: string;
  } | null;
  models: {
    id: number;
    name: string;
  } | null;
  characteristics: Characteristics;
};
