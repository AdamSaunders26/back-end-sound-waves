export interface Wave {
  wave_id: number;
  title: string;
  wave_url: string;
  created_at: string;
  username: string;
  board_slug: string;
  transcript: string;
  censor: boolean;
}

export interface Board {
  board_name: string;
  board_slug: string;
  created_at: string;
  username: string;
  description: string;
}

export interface User {
  username: string;
  email: string;
  avatar_url: string;
  password: string;
}

export interface Comment {
  comment: string;
  created_at: string;
  username: string;
  wave_id: number;
}

export interface Endpoints {}
